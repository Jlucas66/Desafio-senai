package br.com.passe.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.datahora.DataHora;
import br.com.passe.common.dinheiro.Moedas;
import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.dto.FiltroTransacoes;
import br.com.passe.dto.HistoricoResponse;
import br.com.passe.dto.TransacaoResponse;
import br.com.passe.model.TipoTransacao;
import br.com.passe.model.Transacao;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.JogadorRepository;
import br.com.passe.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private static final String CABECALHO_CSV = "data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa";
    private static final String SEPARADOR_CSV = ";";
    private static final String FIM_DE_LINHA = "\n";

    private final TransacaoRepository transacaoRepository;
    private final ClubeRepository clubeRepository;
    private final JogadorRepository jogadorRepository;

    @Transactional(readOnly = true)
    public HistoricoResponse listar(int clubeId, FiltroTransacoes filtro) {
        List<Transacao> transacoes = buscar(clubeId, filtro);
        return new HistoricoResponse(transacoes.stream().map(TransacaoResponse::de).toList(), resumir(transacoes));
    }

    @Transactional(readOnly = true)
    public String exportarCsv(int clubeId, FiltroTransacoes filtro) {
        StringBuilder csv = new StringBuilder(CABECALHO_CSV).append(FIM_DE_LINHA);
        buscar(clubeId, filtro).forEach(transacao -> csv.append(linhaCsv(transacao)).append(FIM_DE_LINHA));
        return csv.toString();
    }

    private List<Transacao> buscar(int clubeId, FiltroTransacoes filtro) {
        if (!clubeRepository.existsById(clubeId)) {
            throw new RecursoNaoEncontradoException("Clube não encontrado.");
        }
        if (filtro.jogadorId() == null) {
            return transacaoRepository.findAllByClubeIdAndTipoInOrderByCriadoEmDescIdDesc(clubeId, filtro.tipos());
        }
        jogadorRepository.buscarAtivo(filtro.jogadorId());
        return transacaoRepository.findAllByClubeIdAndJogadorIdAndTipoInOrderByCriadoEmDescIdDesc(
                clubeId, filtro.jogadorId(), filtro.tipos());
    }

    private static HistoricoResponse.Resumo resumir(List<Transacao> transacoes) {
        Predicate<Transacao> compra = transacao -> transacao.getTipo() == TipoTransacao.COMPRA;
        Predicate<Transacao> venda = transacao -> transacao.getTipo() == TipoTransacao.VENDA;
        return new HistoricoResponse.Resumo(
                somar(transacoes, compra, transacao -> transacao.getValor().add(transacao.getTaxa())),
                somar(transacoes, venda, Transacao::getVariacaoCaixa),
                somar(transacoes, transacao -> true, Transacao::getTaxa),
                somar(transacoes, venda, Transacao::getMulta),
                somar(transacoes, venda, Transacao::getLucro));
    }

    private static BigDecimal somar(List<Transacao> transacoes, Predicate<Transacao> filtro,
            Function<Transacao, BigDecimal> valor) {
        return Moedas.arredondar(transacoes.stream()
                .filter(filtro)
                .map(valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private static String linhaCsv(Transacao transacao) {
        return String.join(SEPARADOR_CSV,
                DataHora.formatar(transacao.getCriadoEm()),
                transacao.getTipo().name(),
                textoCsv(transacao.getNomeJogador()),
                moedaCsv(transacao.getValor()),
                moedaCsv(transacao.getTaxa()),
                moedaCsv(transacao.getMulta()),
                transacao.getLucro() == null ? "" : moedaCsv(transacao.getLucro()),
                moedaCsv(transacao.getVariacaoCaixa()));
    }

    private static String moedaCsv(BigDecimal valor) {
        return Moedas.arredondar(valor).toPlainString().replace('.', ',');
    }

    private static String textoCsv(String texto) {
        if (!texto.contains(SEPARADOR_CSV) && !texto.contains("\"")) {
            return texto;
        }
        return "\"" + texto.replace("\"", "\"\"") + "\"";
    }
}
