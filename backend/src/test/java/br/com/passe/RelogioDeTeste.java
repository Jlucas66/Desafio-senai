package br.com.passe;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

import br.com.passe.common.datahora.DataHora;

/**
 * Relógio dos testes da API: o "agora" do servidor é ajustado por cada teste (RN01, RN15).
 */
public class RelogioDeTeste extends Clock {

    private Instant instante = Instant.now();

    public void ajustar(String dataHora) {
        instante = DataHora.ler(dataHora).orElseThrow().toInstant();
    }

    @Override
    public ZoneId getZone() {
        return DataHora.BRASILIA;
    }

    @Override
    public Clock withZone(ZoneId zona) {
        return this;
    }

    @Override
    public Instant instant() {
        return instante;
    }
}
