package br.com.passe.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.dto.ClubeDetalheResponse;
import br.com.passe.dto.ClubeRequest;
import br.com.passe.dto.ClubeResponse;
import br.com.passe.dto.OrdenacaoClubes;
import br.com.passe.service.ClubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Clubes", description = "Criação, listagem e consulta com elenco")
@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubeController {

    private final ClubeService clubeService;

    @Operation(summary = "Lista os clubes pelo nome ou pelo patrimônio (RN11)")
    @GetMapping
    @Parameter(name = "sort", in = ParameterIn.QUERY, description = "name (padrão), net_worth_asc ou net_worth_desc")
    public List<ClubeResponse> listar(@Parameter(hidden = true) @RequestParam Map<String, String> parametros) {
        return clubeService.listar(OrdenacaoClubes.de(new ParametrosConsulta(parametros)));
    }

    @Operation(summary = "Consulta o clube com o elenco, os contratos, o valor do elenco e o patrimônio (RN11)")
    @GetMapping(Rotas.ID)
    public ClubeDetalheResponse detalhar(@PathVariable int id) {
        return clubeService.detalhar(id);
    }

    @Operation(summary = "Cria um clube com 300,00 em caixa (RN10)")
    @PostMapping
    public ResponseEntity<ClubeResponse> criar(@Valid @RequestBody ClubeRequest dados) {
        ClubeResponse criado = clubeService.criar(dados);
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.id())
                .toUri();
        return ResponseEntity.created(local).body(criado);
    }
}
