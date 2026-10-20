package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import br.com.passe.model.Atributos;
import br.com.passe.model.Posicao;

class CalculadoraOverallTest {

    @ParameterizedTest(name = "{0} {1}/{2}/{3}/{4}/{5}/{6} -> {7}")
    @CsvSource({
        "MEI, 68, 65, 80, 78, 52, 60, 73",
        "ATA, 78, 75, 73, 82, 48, 68, 76",
        "LAT, 72, 70, 78, 76, 70, 66, 72",
        "ZAG, 50, 90, 60, 40, 80, 75, 73",
        "GOL, 55, 30, 65, 40, 72, 68, 68",
        "MEI, 70, 68, 82, 79, 55, 64, 75"
    })
    void calculaPelosPesosDaPosicao(
            Posicao posicao,
            int velocidade,
            int finalizacao,
            int passe,
            int drible,
            int defesa,
            int fisico,
            int esperado) {
        Atributos atributos = new Atributos(velocidade, finalizacao, passe, drible, defesa, fisico);

        assertThat(CalculadoraOverall.calcular(posicao, atributos)).isEqualTo(esperado);
    }
}
