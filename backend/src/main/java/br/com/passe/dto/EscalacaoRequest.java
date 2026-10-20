package br.com.passe.dto;

import java.util.HashSet;
import java.util.List;

import br.com.passe.model.Formacao;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EscalacaoRequest(
        @NotNull(message = "formation é obrigatório.") Formacao formation,
        @NotNull(message = "player_ids é obrigatório.")
                @Size(min = 5, max = 5, message = "player_ids deve ter exatamente 5 ids.")
                List<
                                @NotNull(message = "player_ids não aceita valores nulos.")
                                @Positive(message = "player_ids só aceita inteiros positivos.") Integer>
                        playerIds) {

    @AssertTrue(message = "player_ids não pode ter ids repetidos.")
    public boolean isSemIdsRepetidos() {
        return playerIds == null || new HashSet<>(playerIds).size() == playerIds.size();
    }
}
