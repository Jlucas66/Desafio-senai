package br.com.passe.common.datahora;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class DataHoraTest {

    @Test
    void leNoFormatoDaRn01() {
        assertThat(DataHora.ler("2027-03-02T10:15-03:00"))
                .contains(OffsetDateTime.of(2027, 3, 2, 10, 15, 0, 0, ZoneOffset.ofHours(-3)));
    }

    @ParameterizedTest
    @ValueSource(strings = {"2027-03-02T10:15", "2027-03-02T10:15:00-03:00", "2027-03-02T10:15Z",
            "2027-03-02T10:15-02:00", "2027-03-02 10:15-03:00", "2027-02-30T10:15-03:00", "2027-03-02T24:00-03:00",
            "2027-3-2T10:15-03:00", ""})
    void recusaOutroFormatoOuDataInexistente(String texto) {
        assertThat(DataHora.ler(texto)).isEmpty();
    }

    @Test
    void formataNoHorarioDeBrasiliaComSegundos() {
        OffsetDateTime emUtc = OffsetDateTime.of(2027, 3, 2, 13, 15, 0, 123_456_000, ZoneOffset.UTC);

        assertThat(DataHora.formatar(emUtc)).isEqualTo("2027-03-02T10:15:00-03:00");
    }
}
