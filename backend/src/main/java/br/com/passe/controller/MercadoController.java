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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Mercado", description = "Compra e venda de jogadores")
@RestController
@RequestMapping("/players" + Rotas.ID)
@RequiredArgsConstructor
public class MercadoController {

    private final MercadoService mercadoService;

    @Operation(summary = "Compra um jogador livre e cria o contrato de fidelidade (RN12 a RN14)")
    @PostMapping("/buy")
    public CompraResponse comprar(@PathVariable int id, @Valid @RequestBody CompraRequest dados) {
        return mercadoService.comprar(id, dados);
    }

    @Operation(summary = "Vende o jogador pelo clube atual, com multa e comissão (RN15 e RN16)")
    @PostMapping("/sell")
    public VendaResponse vender(@PathVariable int id) {
        return mercadoService.vender(id);
    }
}
