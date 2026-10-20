package br.com.passe.model;

import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * RN20: atributo usado no duelo, com o nome do campo da API (gravado assim em duelos_partida).
 */
public enum AtributoDuelo {
    SHOOTING("shooting"),
    PASSING("passing"),
    DRIBBLING("dribbling"),
    DEFENDING("defending");

    private final String codigo;

    AtributoDuelo(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }

    public static AtributoDuelo doCodigo(String codigo) {
        return Arrays.stream(values())
                .filter(atributo -> atributo.codigo.equals(codigo))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Atributo inválido: " + codigo));
    }
}
