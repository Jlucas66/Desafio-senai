package br.com.passe.controller;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import br.com.passe.ApiTest;

class JogadorListagemApiTest extends ApiTest {

    @ParameterizedTest(name = "limit {0}, page {1} -> {2} itens, {3} páginas")
    @CsvSource({"10, 1, 10, 3", "10, 3, 3, 3", "10, 4, 0, 3", "50, 1, 23, 1"})
    void paginaDepoisDeFiltrar(int limite, int pagina, int itens, int paginas) throws Exception {
        for (int i = 0; i < 23; i++) {
            cadastrarJogador(com(jogadorValido(), "name", "Jogador " + (char) ('a' + i)));
        }

        mockMvc.perform(get("/players").param("limit", "" + limite).param("page", "" + pagina))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(itens)))
                .andExpect(jsonPath("$.meta.page").value(pagina))
                .andExpect(jsonPath("$.meta.limit").value(limite))
                .andExpect(jsonPath("$.meta.total_items").value(23))
                .andExpect(jsonPath("$.meta.total_pages").value(paginas));
    }

    @Test
    void semJogadoresDevolveListaVazia() throws Exception {
        mockMvc.perform(get("/players"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)))
                .andExpect(jsonPath("$.meta.page").value(1))
                .andExpect(jsonPath("$.meta.limit").value(10))
                .andExpect(jsonPath("$.meta.total_items").value(0))
                .andExpect(jsonPath("$.meta.total_pages").value(0));
    }

    @Test
    void buscaNoNomeSemDiferenciarAcentos() throws Exception {
        cadastrarJogador(com(jogadorValido(), "name", "João Silva"));
        cadastrarJogador(com(jogadorValido(), "name", "Meia Lua"));
        cadastrarJogador(com(jogadorValido(), "name", "Ana Lima"));

        mockMvc.perform(get("/players").param("search", "joao"))
                .andExpect(jsonPath("$.data[*].name", contains("João Silva")));
        mockMvc.perform(get("/players").param("search", "LUA"))
                .andExpect(jsonPath("$.data[*].name", contains("Meia Lua")));
    }

    @Test
    void ordenaPorNomeComAcentosPorPadrao() throws Exception {
        cadastrarJogador(com(jogadorValido(), "name", "Gama Souza"));
        cadastrarJogador(com(jogadorValido(), "name", "Épsilon Dias"));
        cadastrarJogador(com(jogadorValido(), "name", "Delta Reis"));

        mockMvc.perform(get("/players"))
                .andExpect(jsonPath("$.data[*].name", contains("Delta Reis", "Épsilon Dias", "Gama Souza")));
    }

    @Test
    void combinaFiltrosDePosicaoCondicaoIdadeEValor() throws Exception {
        int meia = cadastrarJogador(jogadorValido());
        cadastrarJogador(com(com(jogadorValido(), "name", "Meia Velho"), "age", 30));
        cadastrarJogador(com(jogadorValido(), "position", "ATA"));
        enviar(patch("/players/" + meia + "/condition"), Map.of("condition", "MAL_CONDICIONADO"));

        mockMvc.perform(get("/players").param("position", "MEI").param("condition", "MAL_CONDICIONADO")
                        .param("min_age", "20").param("max_age", "25")
                        .param("min_value", "37").param("max_value", "37.00"))
                .andExpect(jsonPath("$.data[*].id", contains(meia)));
        mockMvc.perform(get("/players").param("max_value", "37"))
                .andExpect(jsonPath("$.meta.total_items").value(2));
        mockMvc.perform(get("/players").param("max_age", "25"))
                .andExpect(jsonPath("$.meta.total_items").value(2));
    }

    @Test
    void ordenaComDoisCriteriosEDesempataPorNomeEId() throws Exception {
        int primeiro = cadastrarJogador(com(com(jogadorValido(), "name", "Bruno Alves"), "age", 30));
        int segundo = cadastrarJogador(com(com(jogadorValido(), "name", "Ana Costa"), "age", 30));
        int terceiro = cadastrarJogador(com(jogadorValido(), "name", "Ana Costa"));
        int quarto = cadastrarJogador(com(com(jogadorValido(), "name", "Caio Lima"), "position", "GOL"));

        mockMvc.perform(get("/players").param("sort", "age_desc"))
                .andExpect(jsonPath("$.data[*].id", contains(segundo, primeiro, terceiro, quarto)));
        mockMvc.perform(get("/players").param("sort", "position,age_asc"))
                .andExpect(jsonPath("$.data[*].id", contains(quarto, terceiro, segundo, primeiro)));
        mockMvc.perform(get("/players").param("sort", "value_desc"))
                .andExpect(jsonPath("$.data[*].id", contains(segundo, terceiro, primeiro, quarto)));
    }

    @Test
    void filtraLivresEPorClube() throws Exception {
        int livre = cadastrarJogador(jogadorValido());
        int contratado = cadastrarJogador(com(jogadorValido(), "name", "Ana Costa"));
        int clube = criarClube("Águias FC", "AGF");
        colocarNoClube(contratado, clube);

        mockMvc.perform(get("/players").param("free", "true"))
                .andExpect(jsonPath("$.data[*].id", contains(livre)));
        mockMvc.perform(get("/players").param("free", "false"))
                .andExpect(jsonPath("$.data[*].id", contains(contratado)));
        mockMvc.perform(get("/players").param("club_id", "" + clube).param("free", "false"))
                .andExpect(jsonPath("$.data[*].id", contains(contratado)));
        mockMvc.perform(get("/players").param("club_id", "99")).andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "position=", "position=mei", "condition=apto", "free=TRUE", "free=1",
            "club_id=0", "club_id=01", "club_id=abc", "page=0", "page=-1", "limit=51", "limit=0", "limit=1.0",
            "min_age=15", "max_age=46", "min_age=30&max_age=20",
            "min_value=-1", "min_value=10.555", "min_value=1e2", "min_value=01", "min_value=10,5", "max_value=550.01",
            "min_value=50&max_value=40", "free=true&club_id=1",
            "sort=POSITION", "sort=value_asc,value_desc", "sort=name,age_asc,position", "sort=name,", "sort=name, age_asc",
            "search=a"
    })
    void recusaParametroInvalidoOuContraditorio(String consulta) throws Exception {
        criarClube("Águias FC", "AGF");

        mockMvc.perform(get("/players?" + consulta)).andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @ValueSource(strings = {"   ", "\tab", "a  "})
    void recusaBuscaVaziaComControleOuCurta(String busca) throws Exception {
        mockMvc.perform(get("/players").param("search", busca)).andExpect(status().isBadRequest());
    }

    @Test
    void aceitaLimitesDosParametros() throws Exception {
        mockMvc.perform(get("/players?min_value=0.5&max_value=550&min_age=16&max_age=45&limit=50&search=ab"
                + "&sort=value_asc,name&parametro_desconhecido=x")).andExpect(status().isOk());
    }
}
