package br.com.passe.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import br.com.passe.model.TipoTransacao;
import br.com.passe.model.Transacao;

public record TransacaoResponse(
        Integer id,
        Integer clubId,
        Integer playerId,
        String playerName,
        TipoTransacao type,
        BigDecimal value,
        BigDecimal fee,
        BigDecimal penalty,
        BigDecimal profit,
        BigDecimal cashChange,
        OffsetDateTime createdAt) {

    public static TransacaoResponse de(Transacao transacao) {
        return new TransacaoResponse(
                transacao.getId(),
                transacao.getClubeId(),
                transacao.getJogadorId(),
                transacao.getNomeJogador(),
                transacao.getTipo(),
                transacao.getValor(),
                transacao.getTaxa(),
                transacao.getMulta(),
                transacao.getLucro(),
                transacao.getVariacaoCaixa(),
                transacao.getCriadoEm());
    }
}
