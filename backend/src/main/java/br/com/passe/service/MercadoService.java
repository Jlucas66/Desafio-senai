package br.com.passe.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.datahora.DataHora;
import br.com.passe.common.exception.RegraNegocioException;
import br.com.passe.common.exception.RequisicaoInvalidaException;
import br.com.passe.dto.CompraRequest;
import br.com.passe.dto.CompraResponse;
import br.com.passe.dto.TransacaoResponse;
import br.com.passe.dto.VendaResponse;
import br.com.passe.model.Clube;
import br.com.passe.model.Contrato;
import br.com.passe.model.Jogador;
import br.com.passe.model.SituacaoContrato;
import br.com.passe.model.TipoTransacao;
import br.com.passe.model.Transacao;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.ContratoRepository;
import br.com.passe.repository.EscalacaoRepository;
import br.com.passe.repository.JogadorRepository;
import br.com.passe.repository.TransacaoRepository;
import br.com.passe.service.calculo.CalculadoraComissao;
import br.com.passe.service.calculo.CalculadoraMulta;
import br.com.passe.service.calculo.CalculadoraTaxaCompra;
import br.com.passe.service.calculo.CalculadoraValorMercado;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MercadoService {

    private static final int MAXIMO_DO_ELENCO = 12;
    private static final Duration FIDELIDADE_MAXIMA = Duration.ofDays(1095);
    private static final BigDecimal DOIS = BigDecimal.valueOf(2);

    private final JogadorRepository jogadorRepository;
    private final ClubeRepository clubeRepository;
    private final ContratoRepository contratoRepository;
    private final TransacaoRepository transacaoRepository;
    private final EscalacaoRepository escalacaoRepository;
    private final Clock clock;

    @Transactional
    public CompraResponse comprar(int jogadorId, CompraRequest dados) {
        Jogador jogador = jogadorRepository.buscarAtivo(jogadorId);
        Clube clube = clubeRepository.buscarParaAtualizar(dados.clubId());
        OffsetDateTime agora = OffsetDateTime.now(clock);
        OffsetDateTime fimDaFidelidade = DataHora.ler(dados.loyaltyUntil()).orElseThrow();
        validarFimDaFidelidade(fimDaFidelidade, agora);
        validarCompra(jogador, clube);

        BigDecimal valor = CalculadoraValorMercado.calcular(jogador);
        BigDecimal taxa = CalculadoraTaxaCompra.calcular(valor);
        BigDecimal custoTotal = valor.add(taxa);
        if (custoTotal.multiply(DOIS).compareTo(clube.getCaixa()) > 0) {
            throw new RegraNegocioException("O custo da compra (" + custoTotal + ") passa do limite de 50% do caixa ("
                    + clube.getCaixa() + ").");
        }

        clube.setCaixa(clube.getCaixa().subtract(custoTotal));
        jogador.setClubeId(clube.getId());
        jogador.setAtualizadoEm(agora);
        Contrato contrato = contratoRepository.save(novoContrato(jogador, clube, valor, fimDaFidelidade, agora));
        Transacao transacao = transacaoRepository.save(novaTransacao(
                jogador,
                clube,
                TipoTransacao.COMPRA,
                valor,
                taxa,
                BigDecimal.ZERO.setScale(2),
                null,
                custoTotal.negate(),
                agora));

        return new CompraResponse(
                TransacaoResponse.de(transacao),
                new CompraResponse.ContratoCompra(
                        contrato.getValorCompra(), contrato.getFidelidadeAte(), contrato.getSituacao()),
                clube.getCaixa());
    }

    @Transactional
    public VendaResponse vender(int jogadorId) {
        Jogador jogador = jogadorRepository.buscarAtivo(jogadorId);
        if (jogador.estaLivre()) {
            throw new RegraNegocioException("Jogador livre não pode ser vendido.");
        }
        Clube clube = clubeRepository.buscarParaAtualizar(jogador.getClubeId());
        Contrato contrato = contratoRepository
                .findByJogadorIdAndSituacao(jogadorId, SituacaoContrato.ATIVO)
                .orElseThrow(() -> new IllegalStateException("Jogador com clube sem contrato ativo: " + jogadorId));
        OffsetDateTime agora = OffsetDateTime.now(clock);

        BigDecimal valor = CalculadoraValorMercado.calcular(jogador);
        int diasRestantes = CalculadoraMulta.diasRestantes(contrato.getFidelidadeAte(), agora);
        int percentualDaMulta = CalculadoraMulta.percentual(diasRestantes);
        BigDecimal multa = CalculadoraMulta.calcular(valor, percentualDaMulta);
        BigDecimal lucro = valor.subtract(contrato.getValorCompra());
        BigDecimal comissao = CalculadoraComissao.calcular(lucro);
        BigDecimal credito = valor.subtract(multa).subtract(comissao);

        clube.setCaixa(clube.getCaixa().add(credito));
        jogador.setClubeId(null);
        jogador.setAtualizadoEm(agora);
        contrato.setSituacao(multa.signum() > 0 ? SituacaoContrato.RESCINDIDO : SituacaoContrato.ENCERRADO);
        contrato.setEncerradoEm(agora);
        escalacaoRepository.removerJogador(jogadorId);
        Transacao transacao = transacaoRepository.save(
                novaTransacao(jogador, clube, TipoTransacao.VENDA, valor, comissao, multa, lucro, credito, agora));

        return new VendaResponse(
                TransacaoResponse.de(transacao),
                contrato.getValorCompra(),
                diasRestantes,
                percentualDaMulta,
                contrato.getSituacao(),
                clube.getCaixa());
    }

    private static void validarFimDaFidelidade(OffsetDateTime fimDaFidelidade, OffsetDateTime agora) {
        if (!fimDaFidelidade.isAfter(agora) || fimDaFidelidade.isAfter(agora.plus(FIDELIDADE_MAXIMA))) {
            throw new RequisicaoInvalidaException(
                    "loyalty_until deve ser depois do momento da compra e até 1.095 dias depois dele.");
        }
    }

    private void validarCompra(Jogador jogador, Clube clube) {
        if (!jogador.estaLivre()) {
            throw new RegraNegocioException("Só jogador livre pode ser comprado.");
        }
        if (transacaoRepository.existsByClubeIdAndJogadorIdAndTipo(
                clube.getId(), jogador.getId(), TipoTransacao.VENDA)) {
            throw new RegraNegocioException("O clube não pode comprar um jogador que ele mesmo já vendeu.");
        }
        if (jogadorRepository.countByClubeId(clube.getId()) >= MAXIMO_DO_ELENCO) {
            throw new RegraNegocioException("O elenco já tem o máximo de " + MAXIMO_DO_ELENCO + " jogadores.");
        }
    }

    private static Contrato novoContrato(
            Jogador jogador,
            Clube clube,
            BigDecimal valorCompra,
            OffsetDateTime fimDaFidelidade,
            OffsetDateTime agora) {
        Contrato contrato = new Contrato();
        contrato.setJogadorId(jogador.getId());
        contrato.setClubeId(clube.getId());
        contrato.setValorCompra(valorCompra);
        contrato.setFidelidadeAte(fimDaFidelidade);
        contrato.setSituacao(SituacaoContrato.ATIVO);
        contrato.setIniciadoEm(agora);
        return contrato;
    }

    private static Transacao novaTransacao(
            Jogador jogador,
            Clube clube,
            TipoTransacao tipo,
            BigDecimal valor,
            BigDecimal taxa,
            BigDecimal multa,
            BigDecimal lucro,
            BigDecimal variacaoCaixa,
            OffsetDateTime agora) {
        Transacao transacao = new Transacao();
        transacao.setClubeId(clube.getId());
        transacao.setJogadorId(jogador.getId());
        transacao.setNomeJogador(jogador.getNome());
        transacao.setTipo(tipo);
        transacao.setValor(valor);
        transacao.setTaxa(taxa);
        transacao.setMulta(multa);
        transacao.setLucro(lucro);
        transacao.setVariacaoCaixa(variacaoCaixa);
        transacao.setCriadoEm(agora);
        return transacao;
    }
}
