package br.com.passe.validation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class RegrasClubeTest {

    @ParameterizedTest(name = "{0} para {1} -> {2}")
    @CsvSource({
        "AGU, Águias FC, true",
        "AFC, Águias FC, true",
        "ASC, Águias FC, true",
        "GUA, Águias FC, false",
        "AXC, Águias FC, false",
        "ACF, Águias FC, false",
        "DFC, Delta FC, true",
        "EEC, Épsilon EC, true",
        "CCC, Ccc Clube, false"
    })
    void siglaUsaLetrasDoNomeNaOrdem(String sigla, String nome, boolean esperado) {
        assertThat(RegrasClube.siglaCorrespondeAoNome(sigla, nome)).isEqualTo(esperado);
    }
}
