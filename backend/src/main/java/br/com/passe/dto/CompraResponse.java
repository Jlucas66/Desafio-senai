package br.com.passe.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import br.com.passe.model.SituacaoContrato;

public record CompraResponse(
        @JsonUnwrapped TransacaoResponse transacao,
        ContratoCompra contract,
        BigDecimal clubCash) {

    public record ContratoCompra(BigDecimal purchaseValue, OffsetDateTime loyaltyUntil, SituacaoContrato status) {
    }
}
