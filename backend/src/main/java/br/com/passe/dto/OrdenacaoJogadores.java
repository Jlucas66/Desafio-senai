package br.com.passe.dto;

import java.util.Arrays;
import java.util.List;

import br.com.passe.common.web.ParametrosConsulta;

/**
 * Valores do parâmetro sort de GET /players (RN07). O campo impede repetir o mesmo critério, como em
 * value_asc,value_desc.
 */
public enum OrdenacaoJogadores {
    NAME("name", "name"),
    VALUE_ASC("value_asc", "value"),
    VALUE_DESC("value_desc", "value"),
    AGE_ASC("age_asc", "age"),
    AGE_DESC("age_desc", "age"),
    POSITION("position", "position");

    private static final String PARAMETRO = "sort";
    private static final int MAXIMO_DE_CRITERIOS = 2;

    private final String codigo;
    private final String campo;

    OrdenacaoJogadores(String codigo, String campo) {
        this.codigo = codigo;
        this.campo = campo;
    }

    public static List<OrdenacaoJogadores> ler(String valor) {
        String[] codigos = valor.split(",", -1);
        if (codigos.length > MAXIMO_DE_CRITERIOS) {
            throw ParametrosConsulta.invalido(PARAMETRO);
        }
        List<OrdenacaoJogadores> criterios =
                Arrays.stream(codigos).map(OrdenacaoJogadores::doCodigo).toList();
        long camposDistintos =
                criterios.stream().map(criterio -> criterio.campo).distinct().count();
        if (camposDistintos < criterios.size()) {
            throw ParametrosConsulta.invalido(PARAMETRO);
        }
        return criterios;
    }

    private static OrdenacaoJogadores doCodigo(String codigo) {
        return Arrays.stream(values())
                .filter(ordenacao -> ordenacao.codigo.equals(codigo))
                .findFirst()
                .orElseThrow(() -> ParametrosConsulta.invalido(PARAMETRO));
    }
}
