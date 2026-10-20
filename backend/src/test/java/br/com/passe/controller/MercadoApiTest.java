package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import br.com.passe.ApiTest;

class MercadoApiTest extends ApiTest {

    private static final String FIDELIDADE = "2027-03-02T10:15-03:00";

    @ParameterizedTest(name = "caixa {0}, valor {1} -> {2}")
    @CsvSource({
        "300.00, 28.00, 200",
        "300.00, 30.00, 200",
        "300.00, 30.01, 200",
        "100.00, 47.62, 200",
        "100.00, 48.00, 409",
        "261.15, 124.36, 409"
    })
    void limiteDeCinquentaPorCentoDoCaixaSemArredondar(String caixa, String valor, int esperado) throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        definirCaixa(clube, caixa);
        definirValorBase(jogador, valor);

        comprar(jogador, clube, FIDELIDADE).andExpect(status().is(esperado));
    }

    @Test
    void compraRecusadaNaoGravaNada() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        definirCaixa(clube, "100.00");
        definirValorBase(jogador, "48.00");

        comprar(jogador, clube, FIDELIDADE)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isNotEmpty());

        mockMvc.perform(get("/clubs/" + clube)).andExpect(jsonPath("$.cash").value(100.00));
        mockMvc.perform(get("/players/" + jogador))
                .andExpect(jsonPath("$.club_id").isEmpty());
        mockMvc.perform(get("/clubs/" + clube + "/transactions"))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void jogadorComClubeNaoPodeSerComprado() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        int jogador = cadastrarJogador(jogadorValido());
        comprar(jogador, aguias, FIDELIDADE).andExpect(status().isOk());

        comprar(jogador, delta, FIDELIDADE).andExpect(status().isConflict());
    }

    @Test
    void elencoTemNoMaximoDozeJogadores() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        for (int i = 0; i < 12; i++) {
            int jogador = cadastrarJogador(com(jogadorValido(), "name", "Jogador " + (char) ('a' + i)));
            definirValorBase(jogador, "1.00");
            comprar(jogador, clube, FIDELIDADE).andExpect(status().isOk());
        }
        int decimoTerceiro = cadastrarJogador(com(jogadorValido(), "name", "Jogador Extra"));
        definirValorBase(decimoTerceiro, "1.00");

        comprar(decimoTerceiro, clube, FIDELIDADE).andExpect(status().isConflict());
    }

    @Test
    void clubeNaoRecompraQuemVendeuMasOutroClubePode() throws Exception {
        int aguias = criarClubePelaApi("Águias FC", "AGU");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        int jogador = cadastrarJogador(jogadorValido());
        comprar(jogador, aguias, FIDELIDADE).andExpect(status().isOk());
        vender(jogador).andExpect(status().isOk());

        comprar(jogador, aguias, FIDELIDADE).andExpect(status().isConflict());
        comprar(jogador, delta, FIDELIDADE).andExpect(status().isOk());
    }

    @Test
    void jogadorExcluidoOuInexistenteE404() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        mockMvc.perform(delete("/players/" + jogador));

        comprar(jogador, clube, FIDELIDADE).andExpect(status().isNotFound());
        comprar(99, clube, FIDELIDADE).andExpect(status().isNotFound());
        vender(jogador).andExpect(status().isNotFound());
    }

    @Test
    void validaClubeDaCompra() throws Exception {
        int jogador = cadastrarJogador(jogadorValido());
        criarClubePelaApi("Águias FC", "AGU");

        comprar(jogador, 99, FIDELIDADE).andExpect(status().isNotFound());
        comprar(jogador, 0, FIDELIDADE).andExpect(status().isBadRequest());
        comprar(jogador, -1, FIDELIDADE).andExpect(status().isBadRequest());
        enviar(post("/players/" + jogador + "/buy"), Map.of("loyalty_until", FIDELIDADE))
                .andExpect(status().isBadRequest());
        enviar(post("/players/" + jogador + "/buy"), Map.of("club_id", "1", "loyalty_until", FIDELIDADE))
                .andExpect(status().isBadRequest());
        enviar(post("/players/" + jogador + "/buy"), "[]").andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @ValueSource(
            strings = {
                "2027-03-02T10:15",
                "2027-03-02T10:15:00-03:00",
                "2027-03-02T10:15Z",
                "2027-02-30T10:15-03:00",
                "2027-03-02T24:00-03:00",
                "2026-11-02T10:15-03:00",
                "2026-11-01T10:15-03:00",
                "2029-11-01T10:16-03:00"
            })
    void recusaFimDaFidelidadeInvalido(String fimDaFidelidade) throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());

        comprar(jogador, clube, fimDaFidelidade).andExpect(status().isBadRequest());
        mockMvc.perform(get("/players/" + jogador))
                .andExpect(jsonPath("$.club_id").isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"2026-11-02T10:16-03:00", "2029-11-01T10:15-03:00"})
    void aceitaFimDaFidelidadeNosLimites(String fimDaFidelidade) throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());

        comprar(jogador, clube, fimDaFidelidade).andExpect(status().isOk());
    }

    @Test
    void jogadorLivreNaoPodeSerVendido() throws Exception {
        int jogador = cadastrarJogador(jogadorValido());

        vender(jogador).andExpect(status().isConflict());
    }

    @Test
    void vendaDepoisDaFidelidadeEncerraOContratoSemMulta() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        comprar(jogador, clube, "2026-11-12T10:15-03:00");

        relogio.ajustar("2026-11-12T10:15-03:00");
        vender(jogador)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.remaining_days").value(0))
                .andExpect(jsonPath("$.penalty_rate").value(0))
                .andExpect(jsonPath("$.penalty").value(0.00))
                .andExpect(jsonPath("$.profit").value(0.00))
                .andExpect(jsonPath("$.fee").value(0.00))
                .andExpect(jsonPath("$.cash_change").value(40.00))
                .andExpect(jsonPath("$.contract_status").value("ENCERRADO"))
                .andExpect(jsonPath("$.club_cash").value(298.00));
    }

    @Test
    void multaTemTetoDeDezEComissaoProgressiva() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        definirValorBase(jogador, "60.00");
        comprar(jogador, clube, "2027-11-02T10:15-03:00")
                .andExpect(jsonPath("$.club_cash").value(237.00));
        definirValorBase(jogador, "75.00");

        vender(jogador)
                .andExpect(jsonPath("$.remaining_days").value(365))
                .andExpect(jsonPath("$.penalty_rate").value(20))
                .andExpect(jsonPath("$.penalty").value(10.00))
                .andExpect(jsonPath("$.profit").value(15.00))
                .andExpect(jsonPath("$.fee").value(2.00))
                .andExpect(jsonPath("$.cash_change").value(63.00))
                .andExpect(jsonPath("$.club_cash").value(300.00));
    }

    @Test
    void vendaComPrejuizoNaoCobraComissao() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int jogador = cadastrarJogador(jogadorValido());
        definirValorBase(jogador, "50.00");
        comprar(jogador, clube, "2027-11-02T10:15-03:00");
        definirValorBase(jogador, "42.50");

        vender(jogador)
                .andExpect(jsonPath("$.penalty").value(8.50))
                .andExpect(jsonPath("$.profit").value(-7.50))
                .andExpect(jsonPath("$.fee").value(0.00))
                .andExpect(jsonPath("$.cash_change").value(34.00));
    }

    @Test
    void consultaDoClubeOrdenaOElencoESomaOsValores() throws Exception {
        int clube = criarClubePelaApi("Águias FC", "AGU");
        int atacante = cadastrarJogador(com(jogadorValido(), "position", "ATA"));
        int meiaB = cadastrarJogador(com(jogadorValido(), "name", "Meia Bravo"));
        int meiaA = cadastrarJogador(com(jogadorValido(), "name", "Meia Alfa"));
        int goleiro = cadastrarJogador(com(jogadorValido(), "position", "GOL"));
        for (int jogador : new int[] {atacante, meiaB, meiaA, goleiro}) {
            comprar(jogador, clube, FIDELIDADE).andExpect(status().isOk());
        }

        mockMvc.perform(get("/clubs/" + clube))
                .andExpect(jsonPath("$.players[*].id", contains(goleiro, meiaA, meiaB, atacante)))
                .andExpect(jsonPath("$.squad_value").value(134.00))
                .andExpect(jsonPath("$.cash").value(160.30))
                .andExpect(jsonPath("$.net_worth").value(294.30));
        mockMvc.perform(get("/players").param("club_id", "" + clube))
                .andExpect(jsonPath("$.meta.total_items").value(4));
    }
}
