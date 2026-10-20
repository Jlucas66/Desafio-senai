package br.com.passe.model;

import java.util.Arrays;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * RN19: formações aceitas, com quantos jogadores de linha ficam na defesa (ZAG ou LAT), no meio (MEI) e no ataque
 * (ATA).
 */
public enum Formacao {
    TRES_UM("3-1", 3, 0, 1),
    DOIS_DOIS("2-2", 2, 0, 2),
    DOIS_UM_UM("2-1-1", 2, 1, 1),
    UM_DOIS_UM("1-2-1", 1, 2, 1);

    private final String codigo;
    private final int defensores;
    private final int meias;
    private final int atacantes;

    Formacao(String codigo, int defensores, int meias, int atacantes) {
        this.codigo = codigo;
        this.defensores = defensores;
        this.meias = meias;
        this.atacantes = atacantes;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }

    public int getDefensores() {
        return defensores;
    }

    public int getMeias() {
        return meias;
    }

    public int getAtacantes() {
        return atacantes;
    }

    @JsonCreator
    public static Formacao doCodigo(String codigo) {
        return Arrays.stream(values())
                .filter(formacao -> formacao.codigo.equals(codigo))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Formação inválida: " + codigo));
    }
}
