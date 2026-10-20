package br.com.passe.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.passe.dto.ClassificacaoResponse;
import br.com.passe.service.ClassificacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Classificação", description = "Tabela da liga")
@RestController
@RequestMapping("/standings")
@RequiredArgsConstructor
public class ClassificacaoController {

    private final ClassificacaoService classificacaoService;

    @Operation(summary = "Classificação de todos os clubes (RN21)")
    @GetMapping
    public List<ClassificacaoResponse> classificar() {
        return classificacaoService.classificar();
    }
}
