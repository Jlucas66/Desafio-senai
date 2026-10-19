package br.com.passe.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record JogadorElencoResponse(
        @JsonUnwrapped JogadorResponse jogador,
        ContratoElencoResponse contract) {
}
