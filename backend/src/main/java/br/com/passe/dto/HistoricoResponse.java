package br.com.passe.dto;

import java.math.BigDecimal;
import java.util.List;

public record HistoricoResponse(List<TransacaoResponse> data, Resumo summary) {

    public record Resumo(
            BigDecimal totalSpent,
            BigDecimal totalReceived,
            BigDecimal totalFees,
            BigDecimal totalPenalties,
            BigDecimal totalProfit) {
    }
}
