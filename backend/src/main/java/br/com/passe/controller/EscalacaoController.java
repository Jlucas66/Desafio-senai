package br.com.passe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.passe.dto.EscalacaoRequest;
import br.com.passe.dto.EscalacaoResponse;
import br.com.passe.service.EscalacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Escalação", description = "Formação e titulares do clube")
@RestController
@RequestMapping("/clubs" + Rotas.ID + "/lineup")
@RequiredArgsConstructor
public class EscalacaoController {

    private final EscalacaoService escalacaoService;

    @Operation(summary = "Escolhe a formação e os 5 titulares, substituindo a escalação (RN19)")
    @PutMapping
    public EscalacaoResponse escalar(@PathVariable int id, @Valid @RequestBody EscalacaoRequest dados) {
        return escalacaoService.escalar(id, dados);
    }

    @Operation(summary = "Consulta a escalação atual do clube (RN19)")
    @GetMapping
    public EscalacaoResponse consultar(@PathVariable int id) {
        return escalacaoService.consultar(id);
    }
}
