package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import br.com.passe.ApiTest;

class ClassificacaoApiTest extends ApiTest {

    @Test
    void classificacaoDoExemploDaRn21() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        int gama = criarClubePelaApi("Gama SC", "GSC");
        int epsilon = criarClubePelaApi("Épsilon EC", "EEC");
        int mangue = criarClubePelaApi("Mangue FC", "MFC");
        int tubaroes = criarClubePelaApi("Tubarões EC", "TEC");
        gravarPartida(aguias, delta, 1, 2);
        gravarPartida(gama, epsilon, 2, 1);
        gravarPartida(epsilon, aguias, 3, 2);
        gravarPartida(delta, gama, 0, 1);

        mockMvc.perform(get("/standings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].club_id", contains(gama, epsilon, delta, mangue, tubaroes, aguias)))
                .andExpect(jsonPath("$[*].position", contains(1, 2, 3, 4, 5, 6)))
                .andExpect(jsonPath("$[*].points", contains(6, 3, 3, 0, 0, 0)))
                .andExpect(jsonPath("$[*].goal_difference", contains(2, 0, 0, 0, 0, -2)))
                .andExpect(jsonPath("$[0].club_name").value("Gama SC"))
                .andExpect(jsonPath("$[0].played").value(2))
                .andExpect(jsonPath("$[0].wins").value(2))
                .andExpect(jsonPath("$[0].goals_for").value(3))
                .andExpect(jsonPath("$[0].goals_against").value(1))
                .andExpect(jsonPath("$[5].losses").value(2))
                .andExpect(jsonPath("$[5].goals_for").value(3));
    }

    @Test
    void classificacaoComEmpateESemClubes() throws Exception {
        mockMvc.perform(get("/standings")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        gravarPartida(aguias, delta, 1, 1);

        mockMvc.perform(get("/standings"))
                .andExpect(jsonPath("$[*].club_id", contains(aguias, delta)))
                .andExpect(jsonPath("$[*].draws", contains(1, 1)))
                .andExpect(jsonPath("$[*].points", contains(1, 1)));
    }

    private void gravarPartida(int mandante, int visitante, int golsMandante, int golsVisitante) {
        jdbcTemplate.update(
                "INSERT INTO partidas (mandante_id, visitante_id, gols_mandante, gols_visitante, "
                        + "formacao_mandante, formacao_visitante) VALUES (?, ?, ?, ?, '2-1-1', '2-1-1')",
                mandante,
                visitante,
                golsMandante,
                golsVisitante);
    }
}
