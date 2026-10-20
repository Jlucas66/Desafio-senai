package br.com.passe.validation;

import br.com.passe.model.Atributos;

/**
 * Limites do jogador que cruzam campos ("Limites de cada campo"), usados pelos DTOs de cadastro e edição.
 */
public final class RegrasJogador {

    private static final int IDADE_MINIMA_VETERANO = 35;
    private static final int AGILIDADE_MAXIMA_VETERANO = 85;
    private static final int SOMA_MAXIMA_DOS_ATRIBUTOS = 480;
    private static final int IDADE_MINIMA_POTENCIAL_ATINGIDO = 33;

    private RegrasJogador() {}

    public static boolean agilidadePermitida(int agilidade, int idade) {
        return idade < IDADE_MINIMA_VETERANO || agilidade <= AGILIDADE_MAXIMA_VETERANO;
    }

    public static boolean somaDosAtributosPermitida(Atributos atributos) {
        return atributos.soma() <= SOMA_MAXIMA_DOS_ATRIBUTOS;
    }

    public static boolean potencialPermitido(int potencial, Atributos atributos, int idade) {
        int maiorAtributo = atributos.maior();
        return idade >= IDADE_MINIMA_POTENCIAL_ATINGIDO ? potencial == maiorAtributo : potencial >= maiorAtributo;
    }
}
