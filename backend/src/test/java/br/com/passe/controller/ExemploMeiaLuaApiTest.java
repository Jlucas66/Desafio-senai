package br.com.passe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.junit.jupiter.api.Test;

import br.com.passe.ApiTest;

/**
 * O cenário que acompanha o Meia Lua nos exemplos 2.2.2 e 2.3.1 a 2.3.4 do enunciado.
 */
class ExemploMeiaLuaApiTest extends ApiTest {

    @Test
    void cadastroCompraConsultaVendaEHistorico() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int meiaLua = cadastrarJogador(jogadorValido());
        enviar(patch("/players/" + meiaLua + "/condition"), Map.of("condition", "MAL_CONDICIONADO"));

        relogio.ajustar("2026-11-02T10:15-03:00");
        comprar(meiaLua, aguias, "2027-03-02T10:15-03:00")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.club_id").value(aguias))
                .andExpect(jsonPath("$.player_id").value(meiaLua))
                .andExpect(jsonPath("$.player_name").value("Meia Lua"))
                .andExpect(jsonPath("$.type").value("COMPRA"))
                .andExpect(jsonPath("$.value").value(37.00))
                .andExpect(jsonPath("$.fee").value(1.85))
                .andExpect(jsonPath("$.penalty").value(0.00))
                .andExpect(jsonPath("$.profit").isEmpty())
                .andExpect(jsonPath("$.cash_change").value(-38.85))
                .andExpect(jsonPath("$.created_at").value("2026-11-02T10:15:00-03:00"))
                .andExpect(jsonPath("$.contract.purchase_value").value(37.00))
                .andExpect(jsonPath("$.contract.loyalty_until").value("2027-03-02T10:15:00-03:00"))
                .andExpect(jsonPath("$.contract.status").value("ATIVO"))
                .andExpect(jsonPath("$.club_cash").value(261.15));

        mockMvc.perform(get("/clubs/" + aguias))
                .andExpect(jsonPath("$.cash").value(261.15))
                .andExpect(jsonPath("$.squad_value").value(37.00))
                .andExpect(jsonPath("$.net_worth").value(298.15))
                .andExpect(jsonPath("$.players[0].id").value(meiaLua))
                .andExpect(jsonPath("$.players[0].club_id").value(aguias))
                .andExpect(jsonPath("$.players[0].market_value").value(37.00))
                .andExpect(jsonPath("$.players[0].contract.purchase_value").value(37.00))
                .andExpect(jsonPath("$.players[0].contract.loyalty_until").value("2027-03-02T10:15:00-03:00"))
                .andExpect(jsonPath("$.players[0].contract.remaining_days").value(120))
                .andExpect(jsonPath("$.players[0].contract.penalty_rate").value(10));

        enviar(patch("/players/" + meiaLua + "/condition"), Map.of("condition", "APTO"));
        relogio.ajustar("2026-11-05T16:40-03:00");
        vender(meiaLua)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("VENDA"))
                .andExpect(jsonPath("$.value").value(40.00))
                .andExpect(jsonPath("$.fee").value(0.30))
                .andExpect(jsonPath("$.penalty").value(4.00))
                .andExpect(jsonPath("$.profit").value(3.00))
                .andExpect(jsonPath("$.cash_change").value(35.70))
                .andExpect(jsonPath("$.created_at").value("2026-11-05T16:40:00-03:00"))
                .andExpect(jsonPath("$.purchase_value").value(37.00))
                .andExpect(jsonPath("$.remaining_days").value(117))
                .andExpect(jsonPath("$.penalty_rate").value(10))
                .andExpect(jsonPath("$.contract_status").value("RESCINDIDO"))
                .andExpect(jsonPath("$.club_cash").value(296.85));

        mockMvc.perform(get("/players/" + meiaLua))
                .andExpect(jsonPath("$.club_id").isEmpty());

        mockMvc.perform(get("/clubs/" + aguias + "/transactions").param("type", "VENDA"))
                .andExpect(jsonPath("$.data[*].type", contains("VENDA")))
                .andExpect(jsonPath("$.summary.total_spent").value(0.00))
                .andExpect(jsonPath("$.summary.total_received").value(35.70))
                .andExpect(jsonPath("$.summary.total_fees").value(0.30))
                .andExpect(jsonPath("$.summary.total_penalties").value(4.00))
                .andExpect(jsonPath("$.summary.total_profit").value(3.00));

        mockMvc.perform(get("/clubs/" + aguias + "/transactions"))
                .andExpect(jsonPath("$.data[*].type", contains("VENDA", "COMPRA")))
                .andExpect(jsonPath("$.summary.total_spent").value(38.85))
                .andExpect(jsonPath("$.summary.total_received").value(35.70))
                .andExpect(jsonPath("$.summary.total_fees").value(2.15))
                .andExpect(jsonPath("$.summary.total_penalties").value(4.00))
                .andExpect(jsonPath("$.summary.total_profit").value(3.00));

        byte[] csv = mockMvc.perform(get("/clubs/" + aguias + "/transactions/export"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", startsWith("text/csv")))
                .andReturn()
                .getResponse()
                .getContentAsByteArray();
        assertThat(new String(csv, StandardCharsets.UTF_8))
                .isEqualTo(
                        """
                data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa
                2026-11-05T16:40:00-03:00;VENDA;Meia Lua;40,00;0,30;4,00;3,00;35,70
                2026-11-02T10:15:00-03:00;COMPRA;Meia Lua;37,00;1,85;0,00;;-38,85
                """);

        mockMvc.perform(get("/clubs/" + aguias + "/transactions/export").param("type", "VENDA"))
                .andExpect(
                        content()
                                .string(
                                        """
                        data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa
                        2026-11-05T16:40:00-03:00;VENDA;Meia Lua;40,00;0,30;4,00;3,00;35,70
                        """));
    }
}
