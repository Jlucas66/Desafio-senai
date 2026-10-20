package br.com.passe.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.dinheiro.Moedas;
import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.common.texto.Textos;
import br.com.passe.dto.ClubeDetalheResponse;
import br.com.passe.dto.ClubeRequest;
import br.com.passe.dto.ClubeResponse;
import br.com.passe.dto.ContratoElencoResponse;
import br.com.passe.dto.JogadorElencoResponse;
import br.com.passe.dto.OrdenacaoClubes;
import br.com.passe.model.Clube;
import br.com.passe.model.Contrato;
import br.com.passe.model.Jogador;
import br.com.passe.model.SituacaoContrato;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.ContratoRepository;
import br.com.passe.repository.JogadorRepository;
import br.com.passe.service.calculo.CalculadoraMulta;
import br.com.passe.service.calculo.CalculadoraValorMercado;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClubeService {

    private static final int MAXIMO_DE_CLUBES = 20;

    private static final Comparator<ClubeResponse> POR_NOME =
            Comparator.comparing(ClubeResponse::name, Textos::compararNomes);
    private static final Comparator<ClubeResponse> DESEMPATE = POR_NOME.thenComparing(ClubeResponse::id);

    private final ClubeRepository clubeRepository;
    private final JogadorRepository jogadorRepository;
    private final ContratoRepository contratoRepository;
    private final JogadorMapper jogadorMapper;
    private final Clock clock;

    @Transactional
    public ClubeResponse criar(ClubeRequest dados) {
        if (clubeRepository.count() >= MAXIMO_DE_CLUBES) {
            throw new RegraNegocioException("A liga já tem o máximo de " + MAXIMO_DE_CLUBES + " clubes.");
        }
        if (clubeRepository.existeComNome(dados.name())) {
            throw new RegraNegocioException("Já existe um clube com esse nome.");
        }
        if (clubeRepository.existsBySigla(dados.acronym())) {
            throw new RegraNegocioException("Já existe um clube com essa sigla.");
        }

        Clube clube = new Clube();
        clube.setNome(dados.name());
        clube.setSigla(dados.acronym());
        clube.setCaixa(Clube.CAIXA_INICIAL);
        clube.setCriadoEm(OffsetDateTime.now(clock));
        return paraResponse(clubeRepository.save(clube), List.of());
    }

    @Transactional(readOnly = true)
    public List<ClubeResponse> listar(OrdenacaoClubes ordenacao) {
        Map<Integer, List<Jogador>> elencos = jogadorRepository.findAllByClubeIdIsNotNull().stream()
                .collect(Collectors.groupingBy(Jogador::getClubeId));
        return clubeRepository.findAll().stream()
                .map(clube -> paraResponse(clube, elencos.getOrDefault(clube.getId(), List.of())))
                .sorted(comparadorDe(ordenacao))
                .toList();
    }

    @Transactional(readOnly = true)
    public ClubeDetalheResponse detalhar(int id) {
        Clube clube = clubeRepository.buscar(id);
        List<Jogador> elenco = jogadorRepository.findAllByClubeId(id).stream()
                .sorted(JogadorMapper.ORDEM_DO_ELENCO)
                .toList();
        Map<Integer, Contrato> contratos =
                contratoRepository.findAllByClubeIdAndSituacao(id, SituacaoContrato.ATIVO).stream()
                        .collect(Collectors.toMap(Contrato::getJogadorId, Function.identity()));
        OffsetDateTime agora = OffsetDateTime.now(clock);

        List<JogadorElencoResponse> jogadores = elenco.stream()
                .map(jogador -> new JogadorElencoResponse(
                        jogadorMapper.paraResponse(jogador),
                        paraContratoDoElenco(contratos.get(jogador.getId()), agora)))
                .toList();
        return new ClubeDetalheResponse(paraResponse(clube, elenco), jogadores);
    }

    private ClubeResponse paraResponse(Clube clube, List<Jogador> elenco) {
        BigDecimal valorDoElenco = Moedas.arredondar(
                elenco.stream().map(CalculadoraValorMercado::calcular).reduce(BigDecimal.ZERO, BigDecimal::add));
        return new ClubeResponse(
                clube.getId(),
                clube.getNome(),
                clube.getSigla(),
                clube.getCaixa(),
                valorDoElenco,
                clube.getCaixa().add(valorDoElenco));
    }

    private static ContratoElencoResponse paraContratoDoElenco(Contrato contrato, OffsetDateTime agora) {
        int diasRestantes = CalculadoraMulta.diasRestantes(contrato.getFidelidadeAte(), agora);
        return new ContratoElencoResponse(
                contrato.getValorCompra(),
                contrato.getFidelidadeAte(),
                diasRestantes,
                CalculadoraMulta.percentual(diasRestantes));
    }

    private static Comparator<ClubeResponse> comparadorDe(OrdenacaoClubes ordenacao) {
        Comparator<ClubeResponse> criterio =
                switch (ordenacao) {
                    case NAME -> POR_NOME;
                    case NET_WORTH_ASC -> Comparator.comparing(ClubeResponse::netWorth);
                    case NET_WORTH_DESC ->
                        Comparator.comparing(ClubeResponse::netWorth).reversed();
                };
        return criterio.thenComparing(DESEMPATE);
    }
}
