package br.com.passe.dto;

import br.com.passe.model.Condicao;
import jakarta.validation.constraints.NotNull;

public record CondicaoRequest(@NotNull(message = "condition é obrigatório.") Condicao condition) {}
