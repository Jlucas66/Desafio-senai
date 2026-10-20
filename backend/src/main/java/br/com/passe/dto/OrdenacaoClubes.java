package br.com.passe.dto;

import java.util.Arrays;

import br.com.passe.common.web.ParametrosConsulta;

/**
 * Valores do parâmetro sort de GET /clubs (RN11): um só valor.
 */
public enum OrdenacaoClubes {
    NAME("name"),
    NET_WORTH_ASC("net_worth_asc"),
    NET_WORTH_DESC("net_worth_desc");

    private final String codigo;

    OrdenacaoClubes(String codigo) {
        this.codigo = codigo;
    }

    public static OrdenacaoClubes de(ParametrosConsulta parametros) {
        return parametros
                .texto("sort")
                .map(valor -> Arrays.stream(values())
                        .filter(ordenacao -> ordenacao.codigo.equals(valor))
                        .findFirst()
                        .orElseThrow(() -> ParametrosConsulta.invalido("sort")))
                .orElse(NAME);
    }
}
