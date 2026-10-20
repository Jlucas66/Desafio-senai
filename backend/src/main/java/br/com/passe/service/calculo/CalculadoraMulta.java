package br.com.passe.service.calculo;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;

import br.com.passe.common.dinheiro.Moedas;

/**
 * RN15: dias restantes de fidelidade (arredondados para cima), percentual pela faixa de dias e multa com teto.
 */
public final class CalculadoraMulta {

    private static final long NANOS_POR_DIA = Duration.ofDays(1).toNanos();
    private static final BigDecimal TETO = new BigDecimal("10.00");

    private CalculadoraMulta() {}

    public static int diasRestantes(OffsetDateTime fimDaFidelidade, OffsetDateTime agora) {
        Duration falta = Duration.between(agora, fimDaFidelidade);
        if (falta.isNegative() || falta.isZero()) {
            return 0;
        }
        return Math.toIntExact(Math.ceilDiv(falta.toNanos(), NANOS_POR_DIA));
    }

    public static int percentual(int diasRestantes) {
        if (diasRestantes == 0) {
            return 0;
        }
        if (diasRestantes <= 30) {
            return 5;
        }
        if (diasRestantes <= 180) {
            return 10;
        }
        return 20;
    }

    public static BigDecimal calcular(BigDecimal valorDeMercado, int percentual) {
        BigDecimal multa = Moedas.arredondar(Moedas.aplicarPercentual(valorDeMercado, BigDecimal.valueOf(percentual)));
        return multa.min(TETO);
    }
}
