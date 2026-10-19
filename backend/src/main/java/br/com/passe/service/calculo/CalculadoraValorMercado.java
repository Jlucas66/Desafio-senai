package br.com.passe.service.calculo;

import java.math.BigDecimal;

import br.com.passe.common.dinheiro.Moedas;
import br.com.passe.model.Condicao;
import br.com.passe.model.Jogador;

/**
 * RN02 a RN05: desconto por condição (ajustado pela agilidade), ajuste por idade, teto do desconto e piso.
 */
public final class CalculadoraValorMercado {

    private static final BigDecimal TETO_DO_DESCONTO = BigDecimal.valueOf(-40);
    private static final BigDecimal AUMENTO_AGILIDADE_BAIXA = BigDecimal.TEN;
    private static final BigDecimal AJUSTE_IDADE = BigDecimal.TEN;
    private static final int AGILIDADE_ALTA = 80;
    private static final int AGILIDADE_BAIXA = 30;
    private static final int IDADE_MINIMA_SEM_AJUSTE = 22;
    private static final int IDADE_MAXIMA_SEM_AJUSTE = 31;

    private CalculadoraValorMercado() {
    }

    public static BigDecimal calcular(Jogador jogador) {
        return calcular(jogador.getValorBase(), jogador.getCondicao(), jogador.getAgilidade(), jogador.getIdade());
    }

    public static BigDecimal calcular(BigDecimal valorBase, Condicao condicao, int agilidade, int idade) {
        BigDecimal percentualTotal = ajustePorIdade(idade)
                .subtract(descontoPorCondicao(condicao, agilidade))
                .max(TETO_DO_DESCONTO);
        BigDecimal valorDeMercado = Moedas.aplicarPercentual(valorBase, Moedas.CEM.add(percentualTotal));
        return Moedas.arredondar(valorDeMercado).max(Jogador.VALOR_MINIMO);
    }

    private static BigDecimal descontoPorCondicao(Condicao condicao, int agilidade) {
        BigDecimal desconto = switch (condicao) {
            case APTO -> BigDecimal.ZERO;
            case MAL_CONDICIONADO -> BigDecimal.valueOf(15);
            case DOENTE -> BigDecimal.valueOf(30);
        };
        if (condicao == Condicao.APTO) {
            return desconto;
        }
        if (agilidade >= AGILIDADE_ALTA) {
            return desconto.divide(BigDecimal.TWO);
        }
        if (agilidade <= AGILIDADE_BAIXA) {
            return desconto.add(AUMENTO_AGILIDADE_BAIXA);
        }
        return desconto;
    }

    private static BigDecimal ajustePorIdade(int idade) {
        if (idade <= Jogador.IDADE_MAXIMA_JOVEM_PROMESSA) {
            return AJUSTE_IDADE;
        }
        if (idade >= IDADE_MINIMA_SEM_AJUSTE && idade <= IDADE_MAXIMA_SEM_AJUSTE) {
            return BigDecimal.ZERO;
        }
        return AJUSTE_IDADE.negate();
    }
}
