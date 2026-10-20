package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import br.com.passe.ApiTest;

class EscalacaoApiTest extends ApiTest {

    private static final String FIDELIDADE = "2027-03-02T10:15-03:00";

    @Test
    void escalaEConsultaNaOrdemDoElenco() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        List<Integer> time = montarAguias(clube);

        escalar(clube, "2-1-1", List.of(time.get(4), time.get(2), time.get(0), time.get(3), time.get(1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.club_id").value(clube))
                .andExpect(jsonPath("$.formation").value("2-1-1"))
                .andExpect(jsonPath("$.complete").value(true))
                .andExpect(jsonPath("$.players[*].position", contains("GOL", "ZAG", "LAT", "MEI", "ATA")))
                .andExpect(jsonPath("$.players[0].market_value").exists());

        mockMvc.perform(get("/clubs/" + clube + "/lineup"))
                .andExpect(jsonPath("$.formation").value("2-1-1"))
                .andExpect(jsonPath("$.players[*].id", contains(time.toArray())));
        mockMvc.perform(get("/clubs/" + clube)).andExpect(jsonPath("$.cash").value(caixaDoClube(clube)));
    }

    @Test
    void clubeSemEscalacao() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");

        mockMvc.perform(get("/clubs/" + clube + "/lineup"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formation").isEmpty())
                .andExpect(jsonPath("$.complete").value(false))
                .andExpect(jsonPath("$.players", hasSize(0)));
        mockMvc.perform(get("/clubs/99/lineup")).andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(
            strings = {
                "{\"player_ids\": [1, 2, 3, 4, 5]}",
                "{\"formation\": \"4-0\", \"player_ids\": [1, 2, 3, 4, 5]}",
                "{\"formation\": 211, \"player_ids\": [1, 2, 3, 4, 5]}",
                "{\"formation\": \"2-1-1\"}",
                "{\"formation\": \"2-1-1\", \"player_ids\": 1}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [1, 2, 3, 4]}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [1, 2, 3, 4, 5, 6]}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [1, 2, 3, 4, 4]}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [0, 2, 3, 4, 5]}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [\"1\", 2, 3, 4, 5]}",
                "{\"formation\": \"2-1-1\", \"player_ids\": [null, 2, 3, 4, 5]}",
                "[]"
            })
    void recusaCorpoDaEscalacaoInvalido(String corpo) throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        montarAguias(clube);

        enviar(put("/clubs/" + clube + "/lineup"), corpo).andExpect(status().isBadRequest());
    }

    @Test
    void jogadorInexistenteOuExcluidoE404() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        List<Integer> time = montarAguias(clube);
        int excluido = cadastrarJogador(com(jogadorValido(), "name", "Jogador Excluido"));
        mockMvc.perform(delete("/players/" + excluido));

        escalar(clube, "2-1-1", List.of(time.get(0), time.get(1), time.get(2), time.get(3), 999))
                .andExpect(status().isNotFound());
        escalar(clube, "2-1-1", List.of(time.get(0), time.get(1), time.get(2), time.get(3), excluido))
                .andExpect(status().isNotFound());
        escalar(99, "2-1-1", time).andExpect(status().isNotFound());
    }

    @Test
    void recusaJogadorForaDoElencoDoenteOuFormacaoQueNaoFecha() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        List<Integer> time = montarAguias(aguias);
        List<Integer> outroTime = montarDelta(delta);
        int livre = cadastrarJogador(com(jogadorValido(), "name", "Jogador Livre"));
        escalar(aguias, "2-1-1", time).andExpect(status().isOk());

        escalar(aguias, "2-1-1", List.of(time.get(0), time.get(1), time.get(2), time.get(3), outroTime.get(4)))
                .andExpect(status().isConflict());
        escalar(aguias, "2-1-1", List.of(time.get(0), time.get(1), time.get(2), time.get(3), livre))
                .andExpect(status().isConflict());
        escalar(aguias, "3-1", time).andExpect(status().isConflict());
        escalar(aguias, "1-2-1", time).andExpect(status().isConflict());
        enviar(patch("/players/" + time.get(3) + "/condition"), Map.of("condition", "DOENTE"));
        escalar(aguias, "2-1-1", time).andExpect(status().isConflict());

        mockMvc.perform(get("/clubs/" + aguias + "/lineup"))
                .andExpect(jsonPath("$.formation").value("2-1-1"))
                .andExpect(jsonPath("$.players", hasSize(4)));
    }

    @Test
    void titularVendidoOuDoenteSaiDaEscalacaoESemVoltarSozinho() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        List<Integer> time = montarAguias(clube);
        escalar(clube, "2-1-1", time).andExpect(status().isOk());

        vender(time.get(4)).andExpect(status().isOk());
        mockMvc.perform(get("/clubs/" + clube + "/lineup"))
                .andExpect(jsonPath("$.formation").value("2-1-1"))
                .andExpect(jsonPath("$.complete").value(false))
                .andExpect(jsonPath("$.players", hasSize(4)));

        enviar(patch("/players/" + time.get(1) + "/condition"), Map.of("condition", "DOENTE"));
        enviar(patch("/players/" + time.get(1) + "/condition"), Map.of("condition", "MAL_CONDICIONADO"));
        mockMvc.perform(get("/clubs/" + clube + "/lineup")).andExpect(jsonPath("$.players", hasSize(3)));
    }

    @Test
    void escalacaoNovaSubstituiAAnterior() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        List<Integer> time = montarAguias(clube);
        int outroLateral = cadastrarJogador(atleta("Caio Reis", "LAT", 60, 60, 60, 60));
        comprar(outroLateral, clube, FIDELIDADE).andExpect(status().isOk());
        escalar(clube, "2-1-1", time).andExpect(status().isOk());

        escalar(clube, "3-1", List.of(time.get(0), time.get(1), time.get(2), outroLateral, time.get(4)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formation").value("3-1"));
        mockMvc.perform(get("/clubs/" + clube + "/lineup"))
                .andExpect(jsonPath("$.players[*].position", contains("GOL", "ZAG", "LAT", "LAT", "ATA")));
    }
}
