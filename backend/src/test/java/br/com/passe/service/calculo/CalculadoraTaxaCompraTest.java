package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class CalculadoraTaxaCompraTest {

    @ParameterizedTest(name = "valor {0} -> taxa {1}")
    @CsvSource({"28.00, 0.00", "30.00, 0.00", "30.01, 1.50", "47.62, 2.38", "48.00, 2.40", "37.00, 1.85"})
    void cobraCincoPorCentoSoAcimaDeTrinta(BigDecimal valorDeMercado, BigDecimal esperado) {
        assertThat(CalculadoraTaxaCompra.calcular(valorDeMercado)).isEqualTo(esperado);
    }
}
