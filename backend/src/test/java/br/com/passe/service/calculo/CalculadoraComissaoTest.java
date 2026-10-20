package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class CalculadoraComissaoTest {

    @ParameterizedTest(name = "lucro {0} -> comissão {1}")
    @CsvSource({"3.00, 0.30", "3.85, 0.39", "10.00, 1.00", "10.01, 1.00", "15.00, 2.00", "-7.50, 0.00", "0.00, 0.00"})
    void cobraDezPorCentoAteDezEVintePorCentoAcima(BigDecimal lucro, BigDecimal esperado) {
        assertThat(CalculadoraComissao.calcular(lucro)).isEqualTo(esperado);
    }
}
