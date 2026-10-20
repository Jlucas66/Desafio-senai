package br.com.passe.dto;

import java.util.List;

import br.com.passe.model.Formacao;

public record EscalacaoResponse(Integer clubId, Formacao formation, boolean complete, List<JogadorResponse> players) {}
