package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import br.com.passe.model.Condicao;

class CalculadoraValorMercadoTest {

    @ParameterizedTest(name = "{0}, {1}, agilidade {2}, idade {3} -> {4}")
    @CsvSource({
        "82.00, APTO, 20, 25, 82.00",
        "82.00, APTO, 50, 19, 90.20",
        "82.00, MAL_CONDICIONADO, 50, 25, 69.70",
        "82.00, MAL_CONDICIONADO, 80, 21, 84.05",
        "82.00, MAL_CONDICIONADO, 30, 33, 53.30",
        "82.00, DOENTE, 90, 25, 69.70",
        "82.00, DOENTE, 30, 25, 49.20",
        "82.00, DOENTE, 10, 40, 49.20",
        "9.50, MAL_CONDICIONADO, 85, 25, 8.79",
        "1.00, MAL_CONDICIONADO, 50, 35, 1.00",
        "40.00, MAL_CONDICIONADO, 85, 25, 37.00"
    })
    void aplicaCondicaoAgilidadeIdadeTetoEPiso(
            BigDecimal valorBase, Condicao condicao, int agilidade, int idade, BigDecimal esperado) {
        assertThat(CalculadoraValorMercado.calcular(valorBase, condicao, agilidade, idade))
                .isEqualTo(esperado);
    }
}
