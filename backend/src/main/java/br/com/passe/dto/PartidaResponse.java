package br.com.passe.dto;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import br.com.passe.model.AtributoDuelo;
import br.com.passe.model.Condicao;
import br.com.passe.model.Formacao;
import br.com.passe.model.Posicao;
import br.com.passe.model.ResultadoPartida;

public record PartidaResponse(
        Integer id,
        OffsetDateTime playedAt,
        Lado home,
        Lado away,
        ResultadoPartida result,
        @JsonInclude(JsonInclude.Include.NON_NULL) List<Duelo> duels) {

    public record Lado(Integer clubId, String clubName, Formacao formation, int goals) {}

    public record Duelo(
            int order, Integer attackingClubId, Participante attacker, Participante defender, boolean goal) {}

    public record Participante(
            Integer playerId,
            String playerName,
            Posicao position,
            Condicao condition,
            AtributoDuelo attribute,
            int value) {}
}
