package br.com.passe;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfig.class)
public abstract class ApiTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @BeforeEach
    void limparBanco() {
        jdbcTemplate.execute("TRUNCATE duelos_partida, partidas, escalacoes, transacoes, contratos, jogadores, clubes "
                + "RESTART IDENTITY CASCADE");
    }

    protected ResultActions enviar(MockHttpServletRequestBuilder pedido, String json) throws Exception {
        return mockMvc.perform(pedido.contentType(MediaType.APPLICATION_JSON).content(json));
    }

    protected ResultActions enviar(MockHttpServletRequestBuilder pedido, Map<String, Object> corpo) throws Exception {
        return enviar(pedido, objectMapper.writeValueAsString(corpo));
    }

    protected static Map<String, Object> jogadorValido() {
        Map<String, Object> jogador = new HashMap<>();
        jogador.put("name", "Meia Lua");
        jogador.put("position", "MEI");
        jogador.put("agility", 85);
        jogador.put("age", 25);
        jogador.put("pace", 70);
        jogador.put("shooting", 68);
        jogador.put("passing", 82);
        jogador.put("dribbling", 79);
        jogador.put("defending", 55);
        jogador.put("physical", 64);
        jogador.put("potential", 86);
        return jogador;
    }

    protected static Map<String, Object> com(Map<String, Object> base, String campo, Object valor) {
        Map<String, Object> alterado = new HashMap<>(base);
        alterado.put(campo, valor);
        return alterado;
    }

    protected int cadastrarJogador(Map<String, Object> jogador) throws Exception {
        String resposta = enviar(post("/players"), jogador)
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        JsonNode corpo = objectMapper.readTree(resposta);
        return corpo.get("id").asInt();
    }

    protected int criarClube(String nome, String sigla) {
        return jdbcTemplate.queryForObject(
                "INSERT INTO clubes (nome, sigla) VALUES (?, ?) RETURNING id", Integer.class, nome, sigla);
    }

    protected void colocarNoClube(int jogadorId, int clubeId) {
        jdbcTemplate.update("UPDATE jogadores SET clube_id = ? WHERE id = ?", clubeId, jogadorId);
    }
}
