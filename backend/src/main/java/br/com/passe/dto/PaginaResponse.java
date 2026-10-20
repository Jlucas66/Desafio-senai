package br.com.passe.dto;

import java.util.List;

public record PaginaResponse<T>(List<T> data, Meta meta) {

    public record Meta(int page, int limit, int totalItems, int totalPages) {}

    public static <T> PaginaResponse<T> de(List<T> itens, int pagina, int limite) {
        int totalItens = itens.size();
        int totalPaginas = (totalItens + limite - 1) / limite;
        long inicio = (long) (pagina - 1) * limite;
        List<T> daPagina = inicio >= totalItens
                ? List.of()
                : itens.subList((int) inicio, (int) Math.min(inicio + limite, totalItens));
        return new PaginaResponse<>(daPagina, new Meta(pagina, limite, totalItens, totalPaginas));
    }
}
