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
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class JogadorController {

    private final JogadorService jogadorService;

    @GetMapping
    public PaginaResponse<JogadorResponse> listar(@RequestParam Map<String, String> parametros) {
        return jogadorService.listar(FiltroJogadores.de(new ParametrosConsulta(parametros)));
    }

    @GetMapping(Rotas.ID)
    public JogadorResponse buscar(@PathVariable int id) {
        return jogadorService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<JogadorResponse> cadastrar(@Valid @RequestBody JogadorCadastroRequest dados) {
        JogadorResponse cadastrado = jogadorService.cadastrar(dados);
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(cadastrado.id())
                .toUri();
        return ResponseEntity.created(local).body(cadastrado);
    }

    @PutMapping(Rotas.ID)
    public JogadorResponse editar(@PathVariable int id, @Valid @RequestBody JogadorEdicaoRequest dados) {
        return jogadorService.editar(id, dados);
    }

    @PatchMapping(Rotas.ID + "/condition")
    public JogadorResponse alterarCondicao(@PathVariable int id, @Valid @RequestBody CondicaoRequest dados) {
        return jogadorService.alterarCondicao(id, dados);
    }

    @DeleteMapping(Rotas.ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable int id) {
        jogadorService.excluir(id);
    }
}
