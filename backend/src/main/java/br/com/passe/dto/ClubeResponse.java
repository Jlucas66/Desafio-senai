package br.com.passe.dto;

import java.math.BigDecimal;

public record ClubeResponse(
        Integer id,
        String name,
        String acronym,
        BigDecimal cash,
        BigDecimal squadValue,
        BigDecimal netWorth) {
}
