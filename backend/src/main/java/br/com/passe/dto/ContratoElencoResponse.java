package br.com.passe.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ContratoElencoResponse(
        BigDecimal purchaseValue,
        OffsetDateTime loyaltyUntil,
        int remainingDays,
        int penaltyRate) {
}
