package br.com.passe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;

import br.com.passe.ApiTest;

class JogadorAlteracaoApiTest extends ApiTest {

    private static final String EDICAO =
            """
            {"name": "Davi Melo", "position": "ATA", "agility": 70, "age": 26}
            """;

    @Test
    void editaSoNomePosicaoAgilidadeEIdade() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(
                        put("/players/" + id),
                        """
                {"name": "Davi Melo", "position": "ATA", "agility": 70, "age": 26,
                 "pace": 99, "potential": 99, "base_value": 1, "condition": "DOENTE"}
                """)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Davi Melo"))
                .andExpect(jsonPath("$.position").value("ATA"))
                .andExpect(jsonPath("$.age").value(26))
                .andExpect(jsonPath("$.pace").value(70))
                .andExpect(jsonPath("$.potential").value(86))
                .andExpect(jsonPath("$.base_value").value(40.00))
                .andExpect(jsonPath("$.condition").value("APTO"))
                .andExpect(jsonPath("$.overall").value(72));
    }

    @Test
    void edicaoExigeOsQuatroCampos() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(put("/players/" + id), "{\"name\": \"Davi Melo\", \"position\": \"ATA\", \"agility\": 70}")
                .andExpect(status().isBadRequest());
        enviar(put("/players/" + id), "[]").andExpect(status().isBadRequest());
    }

    @Test
    void idadeNaoPodeDiminuir() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(put("/players/" + id), "{\"name\": \"Davi Melo\", \"position\": \"MEI\", \"agility\": 70, \"age\": 24}")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isNotEmpty());
        mockMvc.perform(get("/players/" + id)).andExpect(jsonPath("$.name").value("Meia Lua"));
    }

    @Test
    void jogadorComClubeNaoMudaDePosicao() throws Exception {
        int id = cadastrarJogador(jogadorValido());
        colocarNoClube(id, criarClube("Águias FC", "AGF"));

        enviar(put("/players/" + id), EDICAO).andExpect(status().isConflict());
        enviar(put("/players/" + id), EDICAO.replace("ATA", "MEI")).andExpect(status().isOk());
    }

    @Test
    void alteraCondicaoERecalculaValorDeMercado() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(
                        patch("/players/" + id + "/condition"),
                        "{\"condition\": \"MAL_CONDICIONADO\", \"name\": \"Outro Nome\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.condition").value("MAL_CONDICIONADO"))
                .andExpect(jsonPath("$.market_value").value(37.00))
                .andExpect(jsonPath("$.name").value("Meia Lua"));
    }

    @Test
    void doenteNaoVaiDiretoParaApto() throws Exception {
        int id = cadastrarJogador(jogadorValido());
        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "DOENTE"))
                .andExpect(status().isOk());

        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "APTO"))
                .andExpect(status().isConflict());
        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "MAL_CONDICIONADO"))
                .andExpect(status().isOk());
        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "APTO"))
                .andExpect(status().isOk());
    }

    @Test
    void condicaoAtualEAceitaSemMudanca() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "APTO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.condition").value("APTO"));
    }

    @Test
    void validaCorpoDaCondicao() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        enviar(patch("/players/" + id + "/condition"), "{}").andExpect(status().isBadRequest());
        enviar(patch("/players/" + id + "/condition"), "{\"condition\": null}").andExpect(status().isBadRequest());
        enviar(patch("/players/" + id + "/condition"), "{\"condition\": \"apto\"}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void excluiJogadorLivreLogicamente() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        mockMvc.perform(delete("/players/" + id))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        mockMvc.perform(get("/players/" + id)).andExpect(status().isNotFound());
        enviar(put("/players/" + id), EDICAO).andExpect(status().isNotFound());
        enviar(patch("/players/" + id + "/condition"), Map.of("condition", "DOENTE"))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete("/players/" + id)).andExpect(status().isNotFound());
        mockMvc.perform(get("/players"))
                .andExpect(jsonPath("$.meta.total_items").value(0));

        Integer gravados = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM jogadores WHERE excluido_em IS NOT NULL", Integer.class);
        assertThat(gravados).isEqualTo(1);
    }

    @Test
    void jogadorComClubeNaoPodeSerExcluido() throws Exception {
        int id = cadastrarJogador(jogadorValido());
        colocarNoClube(id, criarClube("Águias FC", "AGF"));

        mockMvc.perform(delete("/players/" + id)).andExpect(status().isConflict());
        mockMvc.perform(get("/players/" + id)).andExpect(status().isOk());
    }

    @Test
    void idInvalidoNasAlteracoesE404() throws Exception {
        cadastrarJogador(jogadorValido());

        enviar(put("/players/01"), EDICAO).andExpect(status().isNotFound());
        enviar(patch("/players/abc/condition"), Map.of("condition", "DOENTE")).andExpect(status().isNotFound());
        mockMvc.perform(delete("/players/0")).andExpect(status().isNotFound());
    }
}
