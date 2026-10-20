package br.com.passe.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.dto.CondicaoRequest;
import br.com.passe.dto.FiltroJogadores;
import br.com.passe.dto.JogadorCadastroRequest;
import br.com.passe.dto.JogadorEdicaoRequest;
import br.com.passe.dto.JogadorResponse;
import br.com.passe.dto.PaginaResponse;
import br.com.passe.service.JogadorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Jogadores", description = "Cadastro, consulta, edição, condição física, exclusão e listagem")
@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class JogadorController {

    private final JogadorService jogadorService;

    @Operation(summary = "Lista os jogadores com busca, filtros, ordenação e paginação (RN07)")
    @GetMapping
    @Parameter(
            name = "search",
            in = ParameterIn.QUERY,
            description = "Texto no nome, sem diferenciar maiúsculas e acentos (2 a 100 caracteres)")
    @Parameter(name = "position", in = ParameterIn.QUERY, description = "GOL, ZAG, LAT, MEI ou ATA")
    @Parameter(name = "condition", in = ParameterIn.QUERY, description = "APTO, MAL_CONDICIONADO ou DOENTE")
    @Parameter(name = "free", in = ParameterIn.QUERY, description = "true: só livres; false: só com clube")
    @Parameter(name = "club_id", in = ParameterIn.QUERY, description = "Só os jogadores desse clube")
    @Parameter(name = "min_age", in = ParameterIn.QUERY, description = "Idade mínima (16 a 45)")
    @Parameter(name = "max_age", in = ParameterIn.QUERY, description = "Idade máxima (16 a 45)")
    @Parameter(
            name = "min_value",
            in = ParameterIn.QUERY,
            description = "Valor de mercado mínimo (0 a 550, até 2 casas)")
    @Parameter(
            name = "max_value",
            in = ParameterIn.QUERY,
            description = "Valor de mercado máximo (0 a 550, até 2 casas)")
    @Parameter(
            name = "sort",
            in = ParameterIn.QUERY,
            description = "name, value_asc, value_desc, age_asc, age_desc ou position; até dois, separados por vírgula")
    @Parameter(name = "page", in = ParameterIn.QUERY, description = "Página, a partir de 1 (padrão 1)")
    @Parameter(name = "limit", in = ParameterIn.QUERY, description = "Itens por página, de 1 a 50 (padrão 10)")
    public PaginaResponse<JogadorResponse> listar(
            @Parameter(hidden = true) @RequestParam Map<String, String> parametros) {
        return jogadorService.listar(FiltroJogadores.de(new ParametrosConsulta(parametros)));
    }

    @Operation(summary = "Consulta um jogador, com overall e valor de mercado do momento")
    @GetMapping(Rotas.ID)
    public JogadorResponse buscar(@PathVariable int id) {
        return jogadorService.buscar(id);
    }

    @Operation(summary = "Cadastra um jogador livre e APTO, calculando o valor base (RN06)")
    @PostMapping
    public ResponseEntity<JogadorResponse> cadastrar(@Valid @RequestBody JogadorCadastroRequest dados) {
        JogadorResponse cadastrado = jogadorService.cadastrar(dados);
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(cadastrado.id())
                .toUri();
        return ResponseEntity.created(local).body(cadastrado);
    }

    @Operation(summary = "Edita nome, posição, agilidade e idade (RN08)")
    @PutMapping(Rotas.ID)
    public JogadorResponse editar(@PathVariable int id, @Valid @RequestBody JogadorEdicaoRequest dados) {
        return jogadorService.editar(id, dados);
    }

    @Operation(summary = "Altera a condição física")
    @PatchMapping(Rotas.ID + "/condition")
    public JogadorResponse alterarCondicao(@PathVariable int id, @Valid @RequestBody CondicaoRequest dados) {
        return jogadorService.alterarCondicao(id, dados);
    }

    @Operation(summary = "Exclui logicamente um jogador livre (RN09)")
    @DeleteMapping(Rotas.ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable int id) {
        jogadorService.excluir(id);
    }
}
