package br.com.passe.model;

import java.util.stream.IntStream;

import jakarta.persistence.Embeddable;

@Embeddable
public record Atributos(int velocidade, int finalizacao, int passe, int drible, int defesa, int fisico) {

    public int soma() {
        return valores().sum();
    }

    public int maior() {
        return valores().max().orElseThrow();
    }

    private IntStream valores() {
        return IntStream.of(velocidade, finalizacao, passe, drible, defesa, fisico);
    }
}
