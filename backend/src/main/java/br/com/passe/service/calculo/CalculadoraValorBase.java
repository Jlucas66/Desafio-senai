package br.com.passe.service.calculo;

import java.math.BigDecimal;
import java.util.List;

import br.com.passe.common.dinheiro.Moedas;
import br.com.passe.model.Jogador;

/**
 * RN06, item 3: parte do overall em faixas progressivas, bônus de jovem promessa, arredondamento único e piso.
 */
public final class CalculadoraValorBase {

    private record Faixa(int primeiroPonto, int ultimoPonto, BigDecimal valorPorPonto) {

        BigDecimal valorDosPontos(int overall) {
            int pontosNaFaixa = Math.max(0, Math.min(overall, ultimoPonto) - primeiroPonto + 1);
            return valorPorPonto.multiply(BigDecimal.valueOf(pontosNaFaixa));
        }
    }

    private static final List<Faixa> FAIXAS = List.of(
            new Faixa(41, 60, new BigDecimal("0.50")),
            new Faixa(61, 75, new BigDecimal("2.00")),
            new Faixa(76, 99, new BigDecimal("6.00")));

    private CalculadoraValorBase() {
    }

    public static BigDecimal calcular(int overall, int potencial, int idadeNoCadastro) {
        BigDecimal parteDoOverall = FAIXAS.stream()
                .map(faixa -> faixa.valorDosPontos(overall))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (idadeNoCadastro <= Jogador.IDADE_MAXIMA_JOVEM_PROMESSA) {
            BigDecimal bonusJovemPromessa = BigDecimal.valueOf(100 + potencial - overall);
            parteDoOverall = Moedas.aplicarPercentual(parteDoOverall, bonusJovemPromessa);
        }
        return Moedas.arredondar(parteDoOverall).max(Jogador.VALOR_MINIMO);
    }
}
