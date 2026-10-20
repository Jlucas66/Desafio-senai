package br.com.passe.common.dinheiro;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Moedas {

    public static final BigDecimal CEM = BigDecimal.valueOf(100);

    private Moedas() {}

    public static BigDecimal arredondar(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal aplicarPercentual(BigDecimal valor, BigDecimal percentual) {
        return valor.multiply(percentual).divide(CEM);
    }
}
