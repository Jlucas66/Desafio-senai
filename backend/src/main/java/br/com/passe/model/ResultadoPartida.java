package br.com.passe.model;

public enum ResultadoPartida {
    MANDANTE,
    VISITANTE,
    EMPATE;

    public static ResultadoPartida de(int golsMandante, int golsVisitante) {
        if (golsMandante > golsVisitante) {
            return MANDANTE;
        }
        if (golsVisitante > golsMandante) {
            return VISITANTE;
        }
        return EMPATE;
    }
}
