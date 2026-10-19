package br.com.passe.dto;

import org.hibernate.validator.constraints.Range;

import br.com.passe.common.texto.Textos;
import br.com.passe.model.Posicao;
import br.com.passe.validation.NomeDeJogador;
import br.com.passe.validation.RegrasJogador;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

public record JogadorEdicaoRequest(
        @NotNull(message = "name é obrigatório.") @NomeDeJogador String name,
        @NotNull(message = "position é obrigatório.") Posicao position,
        @NotNull(message = "agility é obrigatório.")
        @Range(min = 1, max = 100, message = "agility deve estar entre 1 e 100.") Integer agility,
        @NotNull(message = "age é obrigatório.")
        @Range(min = 16, max = 45, message = "age deve estar entre 16 e 45.") Integer age) {

    public JogadorEdicaoRequest {
        name = Textos.normalizarEspacos(name);
    }

    @AssertTrue(message = "Com 35 anos ou mais, agility deve ser no máximo 85.")
    public boolean isAgilidadeCompativelComIdade() {
        return agility == null || age == null || RegrasJogador.agilidadePermitida(agility, age);
    }
}
