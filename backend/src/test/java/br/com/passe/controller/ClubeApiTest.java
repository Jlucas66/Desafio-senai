package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import br.com.passe.ApiTest;

class ClubeApiTest extends ApiTest {

    @Test
    void criaClubeComCaixaInicial() throws Exception {
        enviar(post("/clubs"), Map.of("name", "Águias FC", "acronym", "AGU", "cash", 999))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/clubs/1")))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Águias FC"))
                .andExpect(jsonPath("$.acronym").value("AGU"))
                .andExpect(jsonPath("$.cash").value(300.00))
                .andExpect(jsonPath("$.squad_value").value(0.00))
                .andExpect(jsonPath("$.net_worth").value(300.00));
    }

    @Test
    void consultaClubeSemElenco() throws Exception {
        int id = criarClubePelaApi("Águias FC", "AGU");

        mockMvc.perform(get("/clubs/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.players", hasSize(0)))
                .andExpect(jsonPath("$.net_worth").value(300.00));
        mockMvc.perform(get("/clubs/99")).andExpect(status().isNotFound());
        mockMvc.perform(get("/clubs/01")).andExpect(status().isNotFound());
    }

    @Test
    void nomeUnicoIgnorandoMaiusculasMasNaoAcentos() throws Exception {
        criarClubePelaApi("Águias FC", "AGU");

        enviar(post("/clubs"), Map.of("name", "  águias   fc ", "acronym", "AFC")).andExpect(status().isConflict());
        enviar(post("/clubs"), Map.of("name", "Aguias FC", "acronym", "AFC")).andExpect(status().isCreated());
    }

    @Test
    void siglaUnica() throws Exception {
        criarClubePelaApi("Águias FC", "AGU");

        enviar(post("/clubs"), Map.of("name", "Agulhas União", "acronym", "AGU")).andExpect(status().isConflict());
    }

    @Test
    void ligaAceitaNoMaximoVinteClubes() throws Exception {
        String letras = "ABCDEFGHIJKLMNOPQRST";
        for (char letra : letras.toCharArray()) {
            criarClubePelaApi(letra + "ab Clube", letra + "AB");
        }

        enviar(post("/clubs"), Map.of("name", "Zebra Clube", "acronym", "ZEB")).andExpect(status().isConflict());
        mockMvc.perform(get("/clubs")).andExpect(jsonPath("$", hasSize(20)));
    }

    @ParameterizedTest(name = "{0} / {1}")
    @CsvSource({
            "Águias, AGU",
            "Águias FC 2, AGU",
            "Um Dois Tres Quatro Cinco Seis, UDT",
            "Ab, ABX",
            "Águias_FC, AGU",
            "Águias FC, agu",
            "Águias FC, AG",
            "Águias FC, AGUA",
            "Águias FC, ÁGU",
            "Águias FC, GUA",
            "Águias FC, AXC",
            "Aaa Clube, AAA"
    })
    void recusaNomeOuSiglaInvalidos(String nome, String sigla) throws Exception {
        enviar(post("/clubs"), Map.of("name", nome, "acronym", sigla)).andExpect(status().isBadRequest());
    }

    @Test
    void aceitaHifenEPontoNoNome() throws Exception {
        enviar(post("/clubs"), Map.of("name", "Sport Club Recife-PE.", "acronym", "SCR")).andExpect(status().isCreated());
    }

    @ParameterizedTest
    @ValueSource(strings = {"{\"acronym\": \"AGU\"}", "{\"name\": \"Águias FC\"}", "[]", "{\"name\": 1, \"acronym\": \"AGU\"}"})
    void recusaCorpoInvalido(String corpo) throws Exception {
        enviar(post("/clubs"), corpo).andExpect(status().isBadRequest());
    }

    @Test
    void listaPeloNomePorPadraoEPeloPatrimonio() throws Exception {
        int gama = criarClubePelaApi("Gama SC", "GSC");
        int epsilon = criarClubePelaApi("Épsilon EC", "EEC");
        int delta = criarClubePelaApi("Delta FC", "DFC");
        definirCaixa(gama, "310.00");
        definirCaixa(delta, "310.00");

        mockMvc.perform(get("/clubs"))
                .andExpect(jsonPath("$[*].id", contains(delta, epsilon, gama)));
        mockMvc.perform(get("/clubs").param("sort", "net_worth_desc"))
                .andExpect(jsonPath("$[*].id", contains(delta, gama, epsilon)));
        mockMvc.perform(get("/clubs").param("sort", "net_worth_asc"))
                .andExpect(jsonPath("$[*].id", contains(epsilon, delta, gama)));
    }

    @ParameterizedTest
    @ValueSource(strings = {"sort=", "sort=NAME", "sort=net_worth", "sort=name,net_worth_asc"})
    void recusaOrdenacaoInvalida(String consulta) throws Exception {
        mockMvc.perform(get("/clubs?" + consulta)).andExpect(status().isBadRequest());
    }

    @Test
    void semClubesDevolveListaVazia() throws Exception {
        mockMvc.perform(get("/clubs")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
    }
}
