package br.com.passe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;

import br.com.passe.ApiTest;

class JogadorCadastroApiTest extends ApiTest {

    @Test
    void cadastraComValoresCalculadosELocation() throws Exception {
        enviar(post("/players"), jogadorValido())
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/players/1")))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.condition").value("APTO"))
                .andExpect(jsonPath("$.base_value").value(40.00))
                .andExpect(jsonPath("$.market_value").value(40.00))
                .andExpect(jsonPath("$.overall").value(75))
                .andExpect(jsonPath("$.club_id").isEmpty());
    }

    @Test
    void consultaPorId() throws Exception {
        int id = cadastrarJogador(jogadorValido());

        mockMvc.perform(get("/players/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Meia Lua"))
                .andExpect(jsonPath("$.potential").value(86));
    }

    @Test
    void ignoraCamposControladosPeloSistema() throws Exception {
        Map<String, Object> jogador = new HashMap<>(jogadorValido());
        jogador.put("id", 99);
        jogador.put("base_value", 500);
        jogador.put("market_value", 500);
        jogador.put("overall", 99);
        jogador.put("condition", "DOENTE");
        jogador.put("club_id", 1);

        enviar(post("/players"), jogador)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.base_value").value(40.00))
                .andExpect(jsonPath("$.condition").value("APTO"))
                .andExpect(jsonPath("$.club_id").isEmpty());
    }

    @Test
    void normalizaEspacosDoNome() throws Exception {
        enviar(post("/players"), com(jogadorValido(), "name", "  Meia   Zeta "))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Meia Zeta"));
    }

    @Test
    void aceitaInteiroComParteFracionariaZero() throws Exception {
        enviar(post("/players"), com(jogadorValido(), "agility", 50.0))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.agility").value(50));
    }

    @ParameterizedTest
    @ValueSource(strings = {"[]", "\"x\"", "10", "null", "{", "nao e json"})
    void recusaCorpoQueNaoEObjeto(String corpo) throws Exception {
        enviar(post("/players"), corpo)
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", not(emptyString())));
        assertNadaGravado();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "\"agility\": \"15\"",
            "\"agility\": 50.5",
            "\"agility\": true",
            "\"name\": 123",
            "\"position\": \"mei\"",
            "\"position\": 0",
            "\"agility\": null",
            "\"agility\": 3000000000"
    })
    void recusaTipoErradoOuValorDeListaFora(String campo) throws Exception {
        Map<String, Object> semOCampo = new HashMap<>(jogadorValido());
        semOCampo.remove(campo.substring(1, campo.indexOf('"', 1)));
        String corpo = objectMapper.writeValueAsString(semOCampo).replaceFirst("\\{", "{" + campo + ",");

        enviar(post("/players"), corpo).andExpect(status().isBadRequest());
        assertNadaGravado();
    }

    @ParameterizedTest
    @ValueSource(strings = {"name", "position", "agility", "age", "pace", "shooting", "passing", "dribbling",
            "defending", "physical", "potential"})
    void recusaCampoObrigatorioAusente(String campo) throws Exception {
        Map<String, Object> jogador = new HashMap<>(jogadorValido());
        jogador.remove(campo);

        enviar(post("/players"), jogador).andExpect(status().isBadRequest());
        assertNadaGravado();
    }

    @Test
    void campoForaDoSnakeCaseContaComoAusente() throws Exception {
        Map<String, Object> jogador = new HashMap<>(jogadorValido());
        jogador.put("Agility", jogador.remove("agility"));

        enviar(post("/players"), jogador).andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @ValueSource(strings = {"   ", "Ana", "Jo", "Meia Lua 2", "Meia\tLua", "Ana -"})
    void recusaNomeInvalido(String nome) throws Exception {
        enviar(post("/players"), com(jogadorValido(), "name", nome)).andExpect(status().isBadRequest());
    }

    @Test
    void recusaNomeAcimaDe100Caracteres() throws Exception {
        String nome = "Ana " + "a".repeat(97);

        enviar(post("/players"), com(jogadorValido(), "name", nome)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "name", nome.substring(1))).andExpect(status().isCreated());
    }

    @Test
    void validaLimitesDeAgilidadeEIdade() throws Exception {
        enviar(post("/players"), com(jogadorValido(), "agility", 0)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "agility", 101)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "age", 15)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "age", 46)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "agility", 100)).andExpect(status().isCreated());
    }

    @Test
    void comTrintaECincoAnosAgilidadeVaiAteOitentaECinco() throws Exception {
        Map<String, Object> veterano = com(com(jogadorValido(), "age", 35), "potential", 82);

        enviar(post("/players"), com(veterano, "agility", 86)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(veterano, "agility", 85)).andExpect(status().isCreated());
    }

    @Test
    void somaDosAtributosVaiAte480() throws Exception {
        Map<String, Object> jogador = jogadorValido();
        for (String atributo : new String[] {"pace", "shooting", "passing", "dribbling", "defending", "physical"}) {
            jogador.put(atributo, 80);
        }
        jogador.put("potential", 80);

        enviar(post("/players"), jogador).andExpect(status().isCreated());
        enviar(post("/players"), com(jogador, "pace", 81)).andExpect(status().isBadRequest());
    }

    @Test
    void potencialNaoPodeSerMenorQueOMaiorAtributo() throws Exception {
        enviar(post("/players"), com(jogadorValido(), "potential", 81)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(jogadorValido(), "potential", 82)).andExpect(status().isCreated());
    }

    @Test
    void comTrintaETresAnosPotencialIgualAoMaiorAtributo() throws Exception {
        Map<String, Object> veterano = com(jogadorValido(), "age", 33);

        enviar(post("/players"), com(veterano, "potential", 86)).andExpect(status().isBadRequest());
        enviar(post("/players"), com(veterano, "potential", 82)).andExpect(status().isCreated());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/players/abc", "/players/0", "/players/-1", "/players/1.5", "/players/01",
            "/players/2147483648", "/players/1/", "/inexistente"})
    void idForaDoFormatoECaminhoInexistenteSao404(String caminho) throws Exception {
        cadastrarJogador(jogadorValido());

        mockMvc.perform(get(caminho))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", not(emptyString())));
    }

    @Test
    void jogadorInexistenteE404() throws Exception {
        mockMvc.perform(get("/players/1")).andExpect(status().isNotFound());
    }

    private void assertNadaGravado() {
        Integer total = jdbcTemplate.queryForObject("SELECT count(*) FROM jogadores", Integer.class);
        assertThat(total).isZero();
    }
}
