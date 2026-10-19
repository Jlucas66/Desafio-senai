package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import br.com.passe.common.datahora.DataHora;

class CalculadoraMultaTest {

    private static final OffsetDateTime VENDA = DataHora.ler("2026-11-05T16:40-03:00").orElseThrow();

    @ParameterizedTest(name = "fim da fidelidade em {0} -> {1} dias, {2}%")
    @CsvSource({
            "-PT1H, 0, 0",
            "PT0S, 0, 0",
            "P10DT2H, 11, 5",
            "P30D, 30, 5",
            "P30DT1M, 31, 10",
            "P180D, 180, 10",
            "P180DT1M, 181, 20",
            "P200D, 200, 20",
            "P116DT17H35M, 117, 10"
    })
    void contaDiasArredondadosParaCimaEEscolheAFaixa(Duration faltando, int dias, int percentual) {
        int diasRestantes = CalculadoraMulta.diasRestantes(VENDA.plus(faltando), VENDA);

        assertThat(diasRestantes).isEqualTo(dias);
        assertThat(CalculadoraMulta.percentual(diasRestantes)).isEqualTo(percentual);
    }

    @ParameterizedTest(name = "{0} x {1}% -> {2}")
    @CsvSource({
            "40.00, 10, 4.00",
            "42.50, 20, 8.50",
            "30.00, 5, 1.50",
            "25.00, 0, 0.00",
            "75.00, 20, 10.00"
    })
    void aplicaOPercentualComTetoDeDez(BigDecimal valorDeMercado, int percentual, BigDecimal esperado) {
        assertThat(CalculadoraMulta.calcular(valorDeMercado, percentual)).isEqualTo(esperado);
    }

    @Test
    void consultaDoClubeDoExemploTemCentoEVinteDias() {
        OffsetDateTime compra = DataHora.ler("2026-11-02T10:15-03:00").orElseThrow();
        OffsetDateTime fim = DataHora.ler("2027-03-02T10:15-03:00").orElseThrow();

        assertThat(CalculadoraMulta.diasRestantes(fim, compra)).isEqualTo(120);
    }
}
