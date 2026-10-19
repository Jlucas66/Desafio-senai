package br.com.passe.dto;

import org.hibernate.validator.constraints.Range;

import br.com.passe.common.texto.Textos;
import br.com.passe.model.Atributos;
import br.com.passe.model.Posicao;
import br.com.passe.validation.NomeDeJogador;
import br.com.passe.validation.RegrasJogador;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

public record JogadorCadastroRequest(
        @NotNull(message = "name é obrigatório.") @NomeDeJogador String name,
        @NotNull(message = "position é obrigatório.") Posicao position,
        @NotNull(message = "agility é obrigatório.")
        @Range(min = 1, max = 100, message = "agility deve estar entre 1 e 100.") Integer agility,
        @NotNull(message = "age é obrigatório.")
        @Range(min = 16, max = 45, message = "age deve estar entre 16 e 45.") Integer age,
        @NotNull(message = "pace é obrigatório.")
        @Range(min = 1, max = 99, message = "pace deve estar entre 1 e 99.") Integer pace,
        @NotNull(message = "shooting é obrigatório.")
        @Range(min = 1, max = 99, message = "shooting deve estar entre 1 e 99.") Integer shooting,
        @NotNull(message = "passing é obrigatório.")
        @Range(min = 1, max = 99, message = "passing deve estar entre 1 e 99.") Integer passing,
        @NotNull(message = "dribbling é obrigatório.")
        @Range(min = 1, max = 99, message = "dribbling deve estar entre 1 e 99.") Integer dribbling,
        @NotNull(message = "defending é obrigatório.")
        @Range(min = 1, max = 99, message = "defending deve estar entre 1 e 99.") Integer defending,
        @NotNull(message = "physical é obrigatório.")
        @Range(min = 1, max = 99, message = "physical deve estar entre 1 e 99.") Integer physical,
        @NotNull(message = "potential é obrigatório.")
        @Range(min = 1, max = 99, message = "potential deve estar entre 1 e 99.") Integer potential) {

    public JogadorCadastroRequest {
        name = Textos.normalizarEspacos(name);
    }

    public Atributos atributos() {
        return new Atributos(pace, shooting, passing, dribbling, defending, physical);
    }

    @AssertTrue(message = "Com 35 anos ou mais, agility deve ser no máximo 85.")
    public boolean isAgilidadeCompativelComIdade() {
        return agility == null || age == null || RegrasJogador.agilidadePermitida(agility, age);
    }

    @AssertTrue(message = "A soma dos seis atributos não pode passar de 480.")
    public boolean isSomaDosAtributosPermitida() {
        return !atributosInformados() || RegrasJogador.somaDosAtributosPermitida(atributos());
    }

    @AssertTrue(message = "potential deve ser maior ou igual ao maior atributo; com 33 anos ou mais, igual a ele.")
    public boolean isPotencialPermitido() {
        return !atributosInformados() || potential == null || age == null
                || RegrasJogador.potencialPermitido(potential, atributos(), age);
    }

    private boolean atributosInformados() {
        return pace != null && shooting != null && passing != null
                && dribbling != null && defending != null && physical != null;
    }
}
