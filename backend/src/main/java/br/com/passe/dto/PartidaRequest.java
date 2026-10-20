package br.com.passe.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PartidaRequest(
        @NotNull(message = "home_club_id é obrigatório.")
                @Positive(message = "home_club_id deve ser um inteiro positivo.")
                Integer homeClubId,
        @NotNull(message = "away_club_id é obrigatório.")
                @Positive(message = "away_club_id deve ser um inteiro positivo.")
                Integer awayClubId) {

    @AssertTrue(message = "O mandante e o visitante devem ser clubes diferentes.")
    public boolean isClubesDiferentes() {
        return homeClubId == null || awayClubId == null || !homeClubId.equals(awayClubId);
    }
}
