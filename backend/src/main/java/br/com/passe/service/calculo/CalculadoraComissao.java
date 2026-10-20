package br.com.passe.service.calculo;

import java.math.BigDecimal;

import br.com.passe.common.dinheiro.Moedas;

/**
 * RN16, item 3: comissão progressiva sobre o lucro (10% até 10,00 e 20% acima), arredondada uma vez no final.
 */
public final class CalculadoraComissao {

    private static final BigDecimal LIMITE_PRIMEIRA_FAIXA = BigDecimal.TEN;
    private static final BigDecimal PERCENTUAL_PRIMEIRA_FAIXA = BigDecimal.valueOf(10);
    private static final BigDecimal PERCENTUAL_SEGUNDA_FAIXA = BigDecimal.valueOf(20);

    private CalculadoraComissao() {}

    public static BigDecimal calcular(BigDecimal lucro) {
        if (lucro.signum() <= 0) {
            return Moedas.arredondar(BigDecimal.ZERO);
        }
        BigDecimal primeiraFaixa = lucro.min(LIMITE_PRIMEIRA_FAIXA);
        BigDecimal segundaFaixa = lucro.subtract(primeiraFaixa);
        BigDecimal comissao = Moedas.aplicarPercentual(primeiraFaixa, PERCENTUAL_PRIMEIRA_FAIXA)
                .add(Moedas.aplicarPercentual(segundaFaixa, PERCENTUAL_SEGUNDA_FAIXA));
        return Moedas.arredondar(comissao);
    }
}
