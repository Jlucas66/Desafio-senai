package br.com.passe.dto;

import br.com.passe.common.texto.Textos;
import br.com.passe.validation.NomeDeClube;
import br.com.passe.validation.RegrasClube;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ClubeRequest(
        @NotNull(message = "name é obrigatório.") @NomeDeClube String name,
        @NotNull(message = "acronym é obrigatório.")
                @Pattern(regexp = "[A-Z]{3}", message = "acronym deve ter exatamente 3 letras de A a Z, maiúsculas.")
                String acronym) {

    private static final String FORMATO_SIGLA = "[A-Z]{3}";

    public ClubeRequest {
        name = Textos.normalizarEspacos(name);
    }

    @AssertTrue(
            message = "acronym deve usar letras do nome, nessa ordem, começando pela primeira letra do nome, "
                    + "e não pode ter as três letras iguais.")
    public boolean isSiglaCorrespondenteAoNome() {
        return name == null
                || acronym == null
                || !acronym.matches(FORMATO_SIGLA)
                || RegrasClube.siglaCorrespondeAoNome(acronym, name);
    }
}
