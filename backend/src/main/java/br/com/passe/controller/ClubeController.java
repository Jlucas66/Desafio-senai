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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubeController {

    private final ClubeService clubeService;

    @GetMapping
    public List<ClubeResponse> listar(@RequestParam Map<String, String> parametros) {
        return clubeService.listar(OrdenacaoClubes.de(new ParametrosConsulta(parametros)));
    }

    @GetMapping(Rotas.ID)
    public ClubeDetalheResponse detalhar(@PathVariable int id) {
        return clubeService.detalhar(id);
    }

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
