package br.com.passe.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import br.com.passe.model.SituacaoContrato;

public record VendaResponse(
        @JsonUnwrapped TransacaoResponse transacao,
        BigDecimal purchaseValue,
        int remainingDays,
        int penaltyRate,
        SituacaoContrato contractStatus,
        BigDecimal clubCash) {}
