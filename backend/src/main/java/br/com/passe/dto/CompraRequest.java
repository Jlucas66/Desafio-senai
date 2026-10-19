package br.com.passe.dto;

import br.com.passe.validation.DataHoraBrasilia;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CompraRequest(
        @NotNull(message = "club_id é obrigatório.") @Positive(message = "club_id deve ser um inteiro positivo.")
        Integer clubId,
        @NotNull(message = "loyalty_until é obrigatório.") @DataHoraBrasilia String loyaltyUntil) {
}
