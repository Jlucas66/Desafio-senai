package br.com.passe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;

import br.com.passe.ApiTest;

class TransacaoApiTest extends ApiTest {

    private static final String FIDELIDADE = "2027-03-02T10:15-03:00";

    @Test
    void historicoGuardaNomeEValoresDoMomento() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        comprar(jogador, clube, FIDELIDADE);

        enviar(put("/players/" + jogador), "{\"name\": \"Novo Nome\", \"position\": \"MEI\", \"agility\": 85, \"age\": 30}")
                .andExpect(status().isOk());

        mockMvc.perform(get("/clubs/" + clube + "/transactions"))
                .andExpect(jsonPath("$.data[0].player_name").value("Meia Lua"))
                .andExpect(jsonPath("$.data[0].value").value(40.00));
    }

    @Test
    void ordenaDaMaisRecenteParaAMaisAntigaEDesempataPeloId() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int primeiro = cadastrarJogador(jogadorValido());
        int segundo = cadastrarJogador(com(jogadorValido(), "name", "Outro Meia"));
        comprar(primeiro, clube, FIDELIDADE);
        comprar(segundo, clube, FIDELIDADE);
        relogio.ajustar("2026-11-03T10:15-03:00");
        vender(primeiro);

        mockMvc.perform(get("/clubs/" + clube + "/transactions"))
                .andExpect(jsonPath("$.data[*].id", contains(3, 2, 1)));
    }

    @Test
    void caixaConciliaComAsTransacoes() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int primeiro = cadastrarJogador(jogadorValido());
        int segundo = cadastrarJogador(com(jogadorValido(), "name", "Outro Meia"));
        comprar(primeiro, clube, FIDELIDADE);
        comprar(segundo, clube, "2026-11-20T10:15-03:00");
        relogio.ajustar("2026-11-10T08:00-03:00");
        vender(primeiro);
        vender(segundo);

        BigDecimal somaDasVariacoes = jdbcTemplate.queryForObject(
                "SELECT sum(variacao_caixa) FROM transacoes WHERE clube_id = ?", BigDecimal.class, clube);
        BigDecimal caixa = jdbcTemplate.queryForObject("SELECT caixa FROM clubes WHERE id = ?", BigDecimal.class, clube);
        assertThat(new BigDecimal("300.00").add(somaDasVariacoes)).isEqualByComparingTo(caixa);
    }

    @Test
    void filtraPorTipoEJogadorNoSummary() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int primeiro = cadastrarJogador(jogadorValido());
        int segundo = cadastrarJogador(com(jogadorValido(), "name", "Outro Meia"));
        comprar(primeiro, clube, FIDELIDADE);
        comprar(segundo, clube, FIDELIDADE);
        vender(primeiro);

        mockMvc.perform(get("/clubs/" + clube + "/transactions").param("type", "COMPRA"))
                .andExpect(jsonPath("$.data[*].type", contains("COMPRA", "COMPRA")))
                .andExpect(jsonPath("$.summary.total_spent").value(84.00))
                .andExpect(jsonPath("$.summary.total_received").value(0.00));
        mockMvc.perform(get("/clubs/" + clube + "/transactions").param("type", "VENDA,COMPRA").param("player_id", "" + segundo))
                .andExpect(jsonPath("$.data[*].player_id", contains(segundo)))
                .andExpect(jsonPath("$.summary.total_spent").value(42.00))
                .andExpect(jsonPath("$.summary.total_fees").value(2.00));
    }

    @Test
    void jogadorSemTransacoesNoClubeDevolveResumoZerado() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());

        mockMvc.perform(get("/clubs/" + clube + "/transactions").param("player_id", "" + jogador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty())
                .andExpect(jsonPath("$.summary.total_spent").value(0.00))
                .andExpect(jsonPath("$.summary.total_profit").value(0.00));
    }

    @Test
    void jogadorExcluidoSaiDoFiltroMasContinuaNoHistorico() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        comprar(jogador, clube, FIDELIDADE);
        vender(jogador);
        mockMvc.perform(delete("/players/" + jogador)).andExpect(status().isNoContent());

        mockMvc.perform(get("/clubs/" + clube + "/transactions").param("player_id", "" + jogador))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/clubs/" + clube + "/transactions/export").param("player_id", "" + jogador))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
        mockMvc.perform(get("/clubs/" + clube + "/transactions"))
                .andExpect(jsonPath("$.data[*].player_name", contains("Meia Lua", "Meia Lua")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"type=", "type=venda", "type=COMPRA,venda", "type=VENDA,VENDA", "type=COMPRA,", "type=COMPRA, VENDA",
            "player_id=0", "player_id=01", "player_id=abc"})
    void recusaFiltroInvalido(String consulta) throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");

        mockMvc.perform(get("/clubs/" + clube + "/transactions?" + consulta)).andExpect(status().isBadRequest());
        mockMvc.perform(get("/clubs/" + clube + "/transactions/export?" + consulta))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void clubeOuJogadorInexistenteE404() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");

        mockMvc.perform(get("/clubs/99/transactions")).andExpect(status().isNotFound());
        mockMvc.perform(get("/clubs/99/transactions/export")).andExpect(status().isNotFound());
        mockMvc.perform(get("/clubs/" + clube + "/transactions").param("player_id", "99")).andExpect(status().isNotFound());
    }

    @Test
    void exportacaoSemTransacoesTemSoOCabecalho() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");

        mockMvc.perform(get("/clubs/" + clube + "/transactions/export"))
                .andExpect(status().isOk())
                .andExpect(content().string("data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa\n"));
    }

    @Test
    void exportacaoProtegeNomeComPontoEVirgulaOuAspasSemBom() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int aspas = cadastrarJogador(com(jogadorValido(), "name", "Zé \"Foguete\" Lima"));
        int pontoEVirgula = cadastrarJogador(com(jogadorValido(), "name", "Ana;Paula Souza"));
        comprar(aspas, clube, FIDELIDADE);
        comprar(pontoEVirgula, clube, FIDELIDADE);

        byte[] corpo = mockMvc.perform(get("/clubs/" + clube + "/transactions/export"))
                .andReturn().getResponse().getContentAsByteArray();
        String csv = new String(corpo, StandardCharsets.UTF_8);

        assertThat(corpo[0]).isEqualTo((byte) 'd');
        assertThat(csv).doesNotContain("\r");
        assertThat(csv.split("\n", -1)).containsExactly(
                "data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa",
                "2026-11-02T10:15:00-03:00;COMPRA;\"Ana;Paula Souza\";40,00;2,00;0,00;;-42,00",
                "2026-11-02T10:15:00-03:00;COMPRA;\"Zé \"\"Foguete\"\" Lima\";40,00;2,00;0,00;;-42,00",
                "");
    }
}
