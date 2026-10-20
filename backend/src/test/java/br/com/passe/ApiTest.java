package br.com.passe;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    private static final String FIDELIDADE_DO_TIME = "2027-03-02T10:15-03:00";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected RelogioDeTeste relogio;

    @BeforeEach
    void limparBanco() {
        jdbcTemplate.execute("TRUNCATE duelos_partida, partidas, escalacoes, transacoes, contratos, jogadores, clubes "
                + "RESTART IDENTITY CASCADE");
        relogio.ajustar("2026-11-02T10:15-03:00");
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
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode corpo = objectMapper.readTree(resposta);
        return corpo.get("id").asInt();
    }

    protected int criarClubePelaApi(String nome, String sigla) throws Exception {
        String resposta = enviar(post("/clubs"), Map.of("name", nome, "acronym", sigla))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(resposta).get("id").asInt();
    }

    protected ResultActions comprar(int jogadorId, int clubeId, String fimDaFidelidade) throws Exception {
        return enviar(
                post("/players/" + jogadorId + "/buy"), Map.of("club_id", clubeId, "loyalty_until", fimDaFidelidade));
    }

    protected ResultActions vender(int jogadorId) throws Exception {
        return mockMvc.perform(post("/players/" + jogadorId + "/sell"));
    }

    protected void definirValorBase(int jogadorId, String valorBase) {
        jdbcTemplate.update("UPDATE jogadores SET valor_base = ?::numeric WHERE id = ?", valorBase, jogadorId);
    }

    protected void definirCaixa(int clubeId, String caixa) {
        jdbcTemplate.update("UPDATE clubes SET caixa = ?::numeric WHERE id = ?", caixa, clubeId);
    }

    protected int criarClube(String nome, String sigla) {
        return jdbcTemplate.queryForObject(
                "INSERT INTO clubes (nome, sigla) VALUES (?, ?) RETURNING id", Integer.class, nome, sigla);
    }

    protected void colocarNoClube(int jogadorId, int clubeId) {
        jdbcTemplate.update("UPDATE jogadores SET clube_id = ? WHERE id = ?", clubeId, jogadorId);
    }

    protected ResultActions escalar(int clubeId, String formacao, List<Integer> jogadores) throws Exception {
        return enviar(put("/clubs/" + clubeId + "/lineup"), Map.of("formation", formacao, "player_ids", jogadores));
    }

    protected List<Integer> montarAguias(int clube) throws Exception {
        return montarTime(
                clube,
                atleta("Rui Prado", "GOL", 50, 50, 50, 77),
                atleta("Téo Brandão", "ZAG", 50, 50, 50, 84),
                atleta("Davi Lins", "LAT", 50, 50, 74, 66),
                atleta("Lauro Neves", "MEI", 50, 82, 50, 50),
                atleta("Otto Rangel", "ATA", 75, 50, 50, 50));
    }

    protected List<Integer> montarDelta(int clube) throws Exception {
        return montarTime(
                clube,
                atleta("Ivo Teles", "GOL", 50, 50, 50, 72),
                atleta("Hugo Vaz", "ZAG", 50, 50, 50, 84),
                atleta("Lino Matos", "LAT", 50, 50, 79, 63),
                atleta("Nei Soares", "MEI", 50, 70, 50, 50),
                atleta("Ugo Falcão", "ATA", 81, 50, 50, 50));
    }

    @SafeVarargs
    private List<Integer> montarTime(int clube, Map<String, Object>... jogadores) throws Exception {
        List<Integer> ids = new ArrayList<>();
        for (Map<String, Object> jogador : jogadores) {
            int id = cadastrarJogador(jogador);
            comprar(id, clube, FIDELIDADE_DO_TIME).andExpect(status().isOk());
            ids.add(id);
        }
        return ids;
    }

    protected static Map<String, Object> atleta(
            String nome, String posicao, int finalizacao, int passe, int drible, int defesa) {
        Map<String, Object> jogador = new HashMap<>(jogadorValido());
        jogador.put("name", nome);
        jogador.put("position", posicao);
        jogador.put("agility", 50);
        jogador.put("pace", 50);
        jogador.put("shooting", finalizacao);
        jogador.put("passing", passe);
        jogador.put("dribbling", drible);
        jogador.put("defending", defesa);
        jogador.put("physical", 50);
        jogador.put("potential", 90);
        return jogador;
    }

    protected double caixaDoClube(int clube) {
        return jdbcTemplate.queryForObject("SELECT caixa FROM clubes WHERE id = ?", Double.class, clube);
    }
}
