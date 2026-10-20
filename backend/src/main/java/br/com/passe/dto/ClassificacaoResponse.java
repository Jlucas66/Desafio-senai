package br.com.passe.dto;

public record ClassificacaoResponse(
        int position,
        Integer clubId,
        String clubName,
        int played,
        int wins,
        int draws,
        int losses,
        int goalsFor,
        int goalsAgainst,
        int goalDifference,
        int points) {}
