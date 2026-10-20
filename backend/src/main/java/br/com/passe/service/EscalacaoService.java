package br.com.passe.service;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.dto.EscalacaoRequest;
import br.com.passe.dto.EscalacaoResponse;
import br.com.passe.model.Clube;
import br.com.passe.model.Condicao;
import br.com.passe.model.Escalacao;
import br.com.passe.model.EscalacaoId;
import br.com.passe.model.Formacao;
import br.com.passe.model.Jogador;
import br.com.passe.model.Posicao;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.EscalacaoRepository;
import br.com.passe.repository.JogadorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EscalacaoService {

    public static final int TITULARES = 5;

    private final ClubeRepository clubeRepository;
    private final JogadorRepository jogadorRepository;
    private final EscalacaoRepository escalacaoRepository;
    private final JogadorMapper jogadorMapper;
    private final Clock clock;

    @Transactional
    public EscalacaoResponse escalar(int clubeId, EscalacaoRequest dados) {
        Clube clube = clubeRepository.buscarParaAtualizar(clubeId);
        List<Jogador> titulares =
                dados.playerIds().stream().map(jogadorRepository::buscarAtivo).toList();
        validarTitulares(clube, dados.formation(), titulares);

        escalacaoRepository.removerTodosDoClube(clubeId);
        OffsetDateTime agora = OffsetDateTime.now(clock);
        titulares.forEach(titular -> escalacaoRepository.save(novaEscalacao(clubeId, titular, agora)));
        clube.setFormacao(dados.formation());
        return paraResponse(clube, titulares);
    }

    @Transactional(readOnly = true)
    public EscalacaoResponse consultar(int clubeId) {
        Clube clube = clubeRepository.buscar(clubeId);
        return paraResponse(clube, titularesDe(clubeId));
    }

    @Transactional(readOnly = true)
    public List<Jogador> titularesDe(int clubeId) {
        List<Integer> ids = escalacaoRepository.findAllByIdClubeId(clubeId).stream()
                .map(escalacao -> escalacao.getId().jogadorId())
                .toList();
        return jogadorRepository.findAllById(ids).stream()
                .sorted(JogadorMapper.ORDEM_DO_ELENCO)
                .toList();
    }

    private static void validarTitulares(Clube clube, Formacao formacao, List<Jogador> titulares) {
        for (Jogador titular : titulares) {
            if (!clube.getId().equals(titular.getClubeId())) {
                throw new RegraNegocioException("O jogador " + titular.getId() + " não é do elenco do clube.");
            }
            if (titular.getCondicao() == Condicao.DOENTE) {
                throw new RegraNegocioException(
                        "O jogador " + titular.getId() + " está DOENTE e não pode ser escalado.");
            }
        }
        Map<Posicao, Long> porPosicao =
                titulares.stream().collect(Collectors.groupingBy(Jogador::getPosicao, Collectors.counting()));
        long goleiros = porPosicao.getOrDefault(Posicao.GOL, 0L);
        long defensores = porPosicao.getOrDefault(Posicao.ZAG, 0L) + porPosicao.getOrDefault(Posicao.LAT, 0L);
        long meias = porPosicao.getOrDefault(Posicao.MEI, 0L);
        long atacantes = porPosicao.getOrDefault(Posicao.ATA, 0L);
        if (goleiros != 1
                || defensores != formacao.getDefensores()
                || meias != formacao.getMeias()
                || atacantes != formacao.getAtacantes()) {
            throw new RegraNegocioException("As posições dos titulares não fecham a formação " + formacao.getCodigo()
                    + ": são precisos 1 GOL, " + formacao.getDefensores() + " entre ZAG e LAT, "
                    + formacao.getMeias() + " MEI e " + formacao.getAtacantes() + " ATA.");
        }
    }

    private static Escalacao novaEscalacao(int clubeId, Jogador titular, OffsetDateTime agora) {
        Escalacao escalacao = new Escalacao();
        escalacao.setId(new EscalacaoId(clubeId, titular.getId()));
        escalacao.setCriadoEm(agora);
        return escalacao;
    }

    private EscalacaoResponse paraResponse(Clube clube, List<Jogador> titulares) {
        return new EscalacaoResponse(
                clube.getId(),
                clube.getFormacao(),
                clube.getFormacao() != null && titulares.size() == TITULARES,
                titulares.stream()
                        .sorted(JogadorMapper.ORDEM_DO_ELENCO)
                        .map(jogadorMapper::paraResponse)
                        .toList());
    }
}
