package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class CalculadoraValorBaseTest {

    @ParameterizedTest(name = "overall {0}, potencial {1}, idade {2} -> {3}")
    @CsvSource({
        "75, 86, 25, 40.00",
        "60, 70, 30, 10.00",
        "61, 70, 30, 12.00",
        "76, 80, 22, 46.00",
        "85, 92, 27, 100.00",
        "70, 84, 21, 34.20",
        "70, 84, 22, 30.00",
        "45, 90, 18, 3.63",
        "40, 66, 36, 1.00"
    })
    void calculaPelasFaixasDoOverall(int overall, int potencial, int idade, BigDecimal esperado) {
        assertThat(CalculadoraValorBase.calcular(overall, potencial, idade)).isEqualTo(esperado);
    }
}
