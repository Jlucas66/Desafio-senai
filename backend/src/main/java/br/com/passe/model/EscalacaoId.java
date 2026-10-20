package br.com.passe.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public record EscalacaoId(Integer clubeId, Integer jogadorId) implements Serializable {}
