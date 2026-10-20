package br.com.passe.service;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.dto.PartidaRequest;
import br.com.passe.dto.PartidaResponse;
import br.com.passe.model.AtributoDuelo;
import br.com.passe.model.Clube;
import br.com.passe.model.DueloPartida;
import br.com.passe.model.Jogador;
import br.com.passe.model.Partida;
import br.com.passe.model.ResultadoPartida;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.DueloPartidaRepository;
import br.com.passe.repository.PartidaRepository;
import br.com.passe.service.calculo.MotorDePartida;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final DueloPartidaRepository dueloPartidaRepository;
    private final ClubeRepository clubeRepository;
    private final EscalacaoService escalacaoService;
    private final Clock clock;

    @Transactional
    public PartidaResponse jogar(PartidaRequest dados) {
        Clube mandante = clubeRepository.buscar(dados.homeClubId());
        Clube visitante = clubeRepository.buscar(dados.awayClubId());
        MotorDePartida.Time timeMandante = timeEscalado(mandante);
        MotorDePartida.Time timeVisitante = timeEscalado(visitante);

        List<MotorDePartida.Duelo> duelos = MotorDePartida.jogar(timeMandante, timeVisitante);
        Partida partida = new Partida();
        partida.setMandanteId(mandante.getId());
        partida.setVisitanteId(visitante.getId());
        partida.setGolsMandante(MotorDePartida.gols(duelos, mandante.getId()));
        partida.setGolsVisitante(MotorDePartida.gols(duelos, visitante.getId()));
        partida.setFormacaoMandante(mandante.getFormacao());
        partida.setFormacaoVisitante(visitante.getFormacao());
        partida.setJogadaEm(OffsetDateTime.now(clock));
        Partida gravada = partidaRepository.save(partida);
        List<DueloPartida> duelosGravados = duelos.stream()
                .map(duelo -> dueloPartidaRepository.save(paraDueloPartida(gravada, duelo)))
                .toList();

        return paraResponse(gravada, Map.of(mandante.getId(), mandante, visitante.getId(), visitante), duelosGravados);
    }

    @Transactional(readOnly = true)
    public List<PartidaResponse> listar(Integer clubeId) {
        if (clubeId != null && !clubeRepository.existsById(clubeId)) {
            throw new RecursoNaoEncontradoException("Clube não encontrado.");
        }
        List<Partida> partidas = clubeId == null
                ? partidaRepository.findAllByOrderByJogadaEmDescIdDesc()
                : partidaRepository.findAllDoClube(clubeId);
        Map<Integer, Clube> clubes =
                clubeRepository.findAll().stream().collect(Collectors.toMap(Clube::getId, Function.identity()));
        return partidas.stream()
                .map(partida -> paraResponse(partida, clubes, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public PartidaResponse buscar(int id) {
        Partida partida = partidaRepository.buscar(id);
        Map<Integer, Clube> clubes =
                clubeRepository.findAllById(List.of(partida.getMandanteId(), partida.getVisitanteId())).stream()
                        .collect(Collectors.toMap(Clube::getId, Function.identity()));
        return paraResponse(partida, clubes, dueloPartidaRepository.findAllByPartidaIdOrderByOrdem(id));
    }

    private MotorDePartida.Time timeEscalado(Clube clube) {
        List<Jogador> titulares = escalacaoService.titularesDe(clube.getId());
        if (clube.getFormacao() == null || titulares.size() != EscalacaoService.TITULARES) {
            throw new RegraNegocioException("O clube " + clube.getNome() + " não tem a escalação completa.");
        }
        return new MotorDePartida.Time(clube.getId(), titulares);
    }

    private static DueloPartida paraDueloPartida(Partida partida, MotorDePartida.Duelo duelo) {
        DueloPartida dueloPartida = new DueloPartida();
        dueloPartida.setPartidaId(partida.getId());
        dueloPartida.setOrdem(duelo.ordem());
        dueloPartida.setClubeAtacanteId(duelo.clubeAtacanteId());
        dueloPartida.setAtacanteId(duelo.atacante().getId());
        dueloPartida.setDefensorId(duelo.defensor().getId());
        dueloPartida.setNomeAtacante(duelo.atacante().getNome());
        dueloPartida.setNomeDefensor(duelo.defensor().getNome());
        dueloPartida.setPosicaoAtacante(duelo.atacante().getPosicao());
        dueloPartida.setPosicaoDefensor(duelo.defensor().getPosicao());
        dueloPartida.setCondicaoAtacante(duelo.atacante().getCondicao());
        dueloPartida.setCondicaoDefensor(duelo.defensor().getCondicao());
        dueloPartida.setAtributoAtaque(duelo.atributoAtaque());
        dueloPartida.setAtributoDefesa(AtributoDuelo.DEFENDING);
        dueloPartida.setValorAtaque(duelo.valorAtaque());
        dueloPartida.setValorDefesa(duelo.valorDefesa());
        dueloPartida.setGol(duelo.gol());
        return dueloPartida;
    }

    private static PartidaResponse paraResponse(
            Partida partida, Map<Integer, Clube> clubes, List<DueloPartida> duelos) {
        Clube mandante = clubes.get(partida.getMandanteId());
        Clube visitante = clubes.get(partida.getVisitanteId());
        return new PartidaResponse(
                partida.getId(),
                partida.getJogadaEm(),
                new PartidaResponse.Lado(
                        mandante.getId(), mandante.getNome(), partida.getFormacaoMandante(), partida.getGolsMandante()),
                new PartidaResponse.Lado(
                        visitante.getId(),
                        visitante.getNome(),
                        partida.getFormacaoVisitante(),
                        partida.getGolsVisitante()),
                ResultadoPartida.de(partida.getGolsMandante(), partida.getGolsVisitante()),
                duelos == null
                        ? null
                        : duelos.stream().map(PartidaService::paraDueloResponse).toList());
    }

    private static PartidaResponse.Duelo paraDueloResponse(DueloPartida duelo) {
        return new PartidaResponse.Duelo(
                duelo.getOrdem(),
                duelo.getClubeAtacanteId(),
                new PartidaResponse.Participante(
                        duelo.getAtacanteId(),
                        duelo.getNomeAtacante(),
                        duelo.getPosicaoAtacante(),
                        duelo.getCondicaoAtacante(),
                        duelo.getAtributoAtaque(),
                        duelo.getValorAtaque()),
                new PartidaResponse.Participante(
                        duelo.getDefensorId(),
                        duelo.getNomeDefensor(),
                        duelo.getPosicaoDefensor(),
                        duelo.getCondicaoDefensor(),
                        duelo.getAtributoDefesa(),
                        duelo.getValorDefesa()),
                duelo.isGol());
    }
}
