package br.com.passe.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.passe.dto.CompraRequest;
import br.com.passe.dto.CompraResponse;
import br.com.passe.dto.VendaResponse;
import br.com.passe.service.MercadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/players" + Rotas.ID)
@RequiredArgsConstructor
public class MercadoController {

    private final MercadoService mercadoService;

    @PostMapping("/buy")
    public CompraResponse comprar(@PathVariable int id, @Valid @RequestBody CompraRequest dados) {
        return mercadoService.comprar(id, dados);
    }

    @PostMapping("/sell")
    public VendaResponse vender(@PathVariable int id) {
        return mercadoService.vender(id);
    }
}
