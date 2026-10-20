package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.ResultActions;

import br.com.passe.ApiTest;

class PartidaApiTest extends ApiTest {

    @Test
    void partidaDoExemploDaRn20() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        List<Integer> timeAguias = montarAguias(aguias);
        List<Integer> timeDelta = montarDelta(delta);
        enviar(patch("/players/" + timeAguias.get(2) + "/condition"), Map.of("condition", "MAL_CONDICIONADO"));
        escalar(aguias, "2-1-1", timeAguias).andExpect(status().isOk());
        escalar(delta, "2-1-1", timeDelta).andExpect(status().isOk());
        double caixaAntes = caixaDoClube(aguias);
        relogio.ajustar("2026-11-12T15:00-03:00");

        jogar(aguias, delta)
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/matches/1")))
                .andExpect(jsonPath("$.played_at").value("2026-11-12T15:00:00-03:00"))
                .andExpect(jsonPath("$.home.club_id").value(aguias))
                .andExpect(jsonPath("$.home.club_name").value("Águias FC"))
                .andExpect(jsonPath("$.home.formation").value("2-1-1"))
                .andExpect(jsonPath("$.home.goals").value(1))
                .andExpect(jsonPath("$.away.goals").value(2))
                .andExpect(jsonPath("$.result").value("VISITANTE"))
                .andExpect(jsonPath("$.duels", hasSize(6)))
                .andExpect(jsonPath("$.duels[*].goal", contains(true, false, false, true, false, true)))
                .andExpect(jsonPath("$.duels[0].attacking_club_id").value(aguias))
                .andExpect(jsonPath("$.duels[0].attacker.player_name").value("Otto Rangel"))
                .andExpect(jsonPath("$.duels[0].attacker.attribute").value("shooting"))
                .andExpect(jsonPath("$.duels[0].attacker.value").value(75))
                .andExpect(jsonPath("$.duels[0].defender.player_name").value("Ivo Teles"))
                .andExpect(jsonPath("$.duels[0].defender.attribute").value("defending"))
                .andExpect(jsonPath("$.duels[2].attacker.condition").value("MAL_CONDICIONADO"))
                .andExpect(jsonPath("$.duels[2].attacker.value").value(63))
                .andExpect(jsonPath("$.duels[5].defender.value").value(56));

        mockMvc.perform(get("/matches/1"))
                .andExpect(jsonPath("$.duels[*].order", contains(1, 2, 3, 4, 5, 6)))
                .andExpect(jsonPath("$.duels[3].attacking_club_id").value(delta));
        mockMvc.perform(get("/clubs/" + aguias)).andExpect(jsonPath("$.cash").value(caixaAntes));
        mockMvc.perform(get("/clubs/" + aguias + "/lineup"))
                .andExpect(jsonPath("$.complete").value(true));
    }

    @Test
    void partidaGuardaOsDadosDoMomento() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        List<Integer> timeAguias = montarAguias(aguias);
        escalar(aguias, "2-1-1", timeAguias);
        escalar(delta, "2-1-1", montarDelta(delta));
        jogar(aguias, delta).andExpect(status().isCreated());

        enviar(
                put("/players/" + timeAguias.get(4)),
                "{\"name\": \"Nome Novo\", \"position\": \"ATA\", \"agility\": 50, \"age\": 26}");
        vender(timeAguias.get(4));

        mockMvc.perform(get("/matches/1"))
                .andExpect(jsonPath("$.duels[0].attacker.player_name").value("Otto Rangel"));
    }

    @Test
    void recusaPartidaInvalida() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        escalar(aguias, "2-1-1", montarAguias(aguias));

        jogar(aguias, aguias).andExpect(status().isBadRequest());
        jogar(0, delta).andExpect(status().isBadRequest());
        enviar(post("/matches"), Map.of("home_club_id", aguias)).andExpect(status().isBadRequest());
        enviar(post("/matches"), Map.of("home_club_id", "1", "away_club_id", delta))
                .andExpect(status().isBadRequest());
        jogar(aguias, 99).andExpect(status().isNotFound());
        jogar(aguias, delta).andExpect(status().isConflict());
        jogar(delta, aguias).andExpect(status().isConflict());
        mockMvc.perform(get("/matches")).andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void historicoDePartidasDaMaisRecenteParaAMaisAntigaComFiltro() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        int gama = criarClubePelaApi("Gama SC", "GSC");
        escalar(aguias, "2-1-1", montarAguias(aguias));
        escalar(delta, "2-1-1", montarDelta(delta));
        jogar(aguias, delta);
        relogio.ajustar("2026-11-03T10:15-03:00");
        jogar(delta, aguias);

        mockMvc.perform(get("/matches"))
                .andExpect(jsonPath("$[*].id", contains(2, 1)))
                .andExpect(jsonPath("$[0].duels").doesNotExist());
        mockMvc.perform(get("/matches").param("club_id", "" + aguias)).andExpect(jsonPath("$", hasSize(2)));
        mockMvc.perform(get("/matches").param("club_id", "" + gama)).andExpect(jsonPath("$", hasSize(0)));
        mockMvc.perform(get("/matches").param("club_id", "99")).andExpect(status().isNotFound());
        mockMvc.perform(get("/matches").param("club_id", "0")).andExpect(status().isBadRequest());
        mockMvc.perform(get("/matches/99")).andExpect(status().isNotFound());
    }

    private ResultActions jogar(int mandante, int visitante) throws Exception {
        return enviar(post("/matches"), Map.of("home_club_id", mandante, "away_club_id", visitante));
    }
}
