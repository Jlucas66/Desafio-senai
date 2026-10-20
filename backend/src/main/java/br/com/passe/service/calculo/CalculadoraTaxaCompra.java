package br.com.passe.service.calculo;

import java.math.BigDecimal;

import br.com.passe.common.dinheiro.Moedas;

/**
 * RN13: taxa de 5% do valor de mercado, cobrada só quando ele passa de 30,00.
 */
public final class CalculadoraTaxaCompra {

    private static final BigDecimal VALOR_SEM_TAXA = new BigDecimal("30.00");
    private static final BigDecimal PERCENTUAL = BigDecimal.valueOf(5);

    private CalculadoraTaxaCompra() {}

    public static BigDecimal calcular(BigDecimal valorDeMercado) {
        if (valorDeMercado.compareTo(VALOR_SEM_TAXA) <= 0) {
            return Moedas.arredondar(BigDecimal.ZERO);
        }
        return Moedas.arredondar(Moedas.aplicarPercentual(valorDeMercado, PERCENTUAL));
    }
}
