package br.com.passe.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.common.texto.Textos;
import br.com.passe.dto.CondicaoRequest;
import br.com.passe.dto.FiltroJogadores;
import br.com.passe.dto.JogadorCadastroRequest;
import br.com.passe.dto.JogadorEdicaoRequest;
import br.com.passe.dto.JogadorResponse;
import br.com.passe.dto.OrdenacaoJogadores;
import br.com.passe.dto.PaginaResponse;
import br.com.passe.model.Atributos;
import br.com.passe.model.Condicao;
import br.com.passe.model.Jogador;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.JogadorRepository;
import br.com.passe.service.calculo.CalculadoraOverall;
import br.com.passe.service.calculo.CalculadoraValorBase;
import br.com.passe.service.calculo.CalculadoraValorMercado;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JogadorService {

    private static final Comparator<JogadorResponse> POR_NOME =
            Comparator.comparing(JogadorResponse::name, Textos::compararNomes);
    private static final Comparator<JogadorResponse> DESEMPATE = POR_NOME.thenComparing(JogadorResponse::id);

    private final JogadorRepository jogadorRepository;
    private final ClubeRepository clubeRepository;
    private final Clock clock;

    @Transactional
    public JogadorResponse cadastrar(JogadorCadastroRequest dados) {
        Atributos atributos = dados.atributos();
        int overall = CalculadoraOverall.calcular(dados.position(), atributos);
        OffsetDateTime agora = agora();

        Jogador jogador = new Jogador();
        jogador.setNome(dados.name());
        jogador.setPosicao(dados.position());
        jogador.setAgilidade(dados.agility());
        jogador.setIdade(dados.age());
        jogador.setAtributos(atributos);
        jogador.setPotencial(dados.potential());
        jogador.setValorBase(CalculadoraValorBase.calcular(overall, dados.potential(), dados.age()));
        jogador.setCondicao(Condicao.APTO);
        jogador.setCriadoEm(agora);
        jogador.setAtualizadoEm(agora);

        return paraResponse(jogadorRepository.save(jogador));
    }

    @Transactional(readOnly = true)
    public JogadorResponse buscar(int id) {
        return paraResponse(buscarAtivo(id));
    }

    @Transactional
    public JogadorResponse editar(int id, JogadorEdicaoRequest dados) {
        Jogador jogador = buscarAtivo(id);
        if (!jogador.estaLivre() && dados.position() != jogador.getPosicao()) {
            throw new RegraNegocioException("Jogador com clube não pode mudar de posição.");
        }
        if (dados.age() < jogador.getIdade()) {
            throw new RegraNegocioException("A idade não pode ser menor que a atual (" + jogador.getIdade() + ").");
        }

        jogador.setNome(dados.name());
        jogador.setPosicao(dados.position());
        jogador.setAgilidade(dados.agility());
        jogador.setIdade(dados.age());
        jogador.setAtualizadoEm(agora());
        return paraResponse(jogador);
    }

    @Transactional
    public JogadorResponse alterarCondicao(int id, CondicaoRequest dados) {
        Jogador jogador = buscarAtivo(id);
        Condicao novaCondicao = dados.condition();
        if (novaCondicao == jogador.getCondicao()) {
            return paraResponse(jogador);
        }
        if (jogador.getCondicao() == Condicao.DOENTE && novaCondicao == Condicao.APTO) {
            throw new RegraNegocioException("Jogador DOENTE não pode passar direto para APTO.");
        }

        jogador.setCondicao(novaCondicao);
        jogador.setAtualizadoEm(agora());
        return paraResponse(jogador);
    }

    @Transactional
    public void excluir(int id) {
        Jogador jogador = buscarAtivo(id);
        if (!jogador.estaLivre()) {
            throw new RegraNegocioException("Só jogador livre pode ser excluído.");
        }

        OffsetDateTime agora = agora();
        jogador.setExcluidoEm(agora);
        jogador.setAtualizadoEm(agora);
    }

    @Transactional(readOnly = true)
    public PaginaResponse<JogadorResponse> listar(FiltroJogadores filtro) {
        if (filtro.clubeId() != null && !clubeRepository.existsById(filtro.clubeId())) {
            throw new RecursoNaoEncontradoException("Clube não encontrado.");
        }
        List<JogadorResponse> encontrados = jogadorRepository.findAllByExcluidoEmIsNull().stream()
                .map(this::paraResponse)
                .filter(jogador -> atendeAoFiltro(jogador, filtro))
                .sorted(comparadorDe(filtro.ordenacao()))
                .toList();
        return PaginaResponse.de(encontrados, filtro.pagina(), filtro.limite());
    }

    private JogadorResponse paraResponse(Jogador jogador) {
        int overall = CalculadoraOverall.calcular(jogador.getPosicao(), jogador.getAtributos());
        BigDecimal valorDeMercado = CalculadoraValorMercado.calcular(
                jogador.getValorBase(), jogador.getCondicao(), jogador.getAgilidade(), jogador.getIdade());
        return JogadorResponse.de(jogador, overall, valorDeMercado);
    }

    private boolean atendeAoFiltro(JogadorResponse jogador, FiltroJogadores filtro) {
        return (filtro.busca() == null || contem(jogador.name(), filtro.busca()))
                && (filtro.posicao() == null || jogador.position() == filtro.posicao())
                && (filtro.condicao() == null || jogador.condition() == filtro.condicao())
                && (filtro.livre() == null || filtro.livre() == (jogador.clubId() == null))
                && (filtro.clubeId() == null || filtro.clubeId().equals(jogador.clubId()))
                && jogador.age() >= filtro.idadeMinima()
                && jogador.age() <= filtro.idadeMaxima()
                && jogador.marketValue().compareTo(filtro.valorMinimo()) >= 0
                && jogador.marketValue().compareTo(filtro.valorMaximo()) <= 0;
    }

    private static boolean contem(String nome, String busca) {
        return Textos.semAcentosEmMinusculas(nome).contains(Textos.semAcentosEmMinusculas(busca));
    }

    private static Comparator<JogadorResponse> comparadorDe(List<OrdenacaoJogadores> criterios) {
        return criterios.stream()
                .map(JogadorService::comparadorDe)
                .reduce(Comparator::thenComparing)
                .orElseThrow()
                .thenComparing(DESEMPATE);
    }

    private static Comparator<JogadorResponse> comparadorDe(OrdenacaoJogadores criterio) {
        return switch (criterio) {
            case NAME -> POR_NOME;
            case VALUE_ASC -> Comparator.comparing(JogadorResponse::marketValue);
            case VALUE_DESC -> Comparator.comparing(JogadorResponse::marketValue).reversed();
            case AGE_ASC -> Comparator.comparing(JogadorResponse::age);
            case AGE_DESC -> Comparator.comparing(JogadorResponse::age).reversed();
            case POSITION -> Comparator.comparing(JogadorResponse::position);
        };
    }

    private Jogador buscarAtivo(int id) {
        return jogadorRepository.findByIdAndExcluidoEmIsNull(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Jogador não encontrado."));
    }

    private OffsetDateTime agora() {
        return OffsetDateTime.now(clock);
    }
}
