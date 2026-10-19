package br.com.passe.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record ClubeDetalheResponse(
        @JsonUnwrapped ClubeResponse clube,
        List<JogadorElencoResponse> players) {
}
