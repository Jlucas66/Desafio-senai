package br.com.passe.dto;

import java.util.Arrays;
import java.util.List;

import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.model.TipoTransacao;

/**
 * Query params do histórico e da exportação (RN17 e RN18): type com um ou mais tipos, sem espaços e sem repetição,
 * e player_id.
 */
public record FiltroTransacoes(List<TipoTransacao> tipos, Integer jogadorId) {

    private static final String PARAMETRO_TIPO = "type";

    public static FiltroTransacoes de(ParametrosConsulta parametros) {
        List<TipoTransacao> tipos = parametros.texto(PARAMETRO_TIPO)
                .map(FiltroTransacoes::lerTipos)
                .orElse(List.of(TipoTransacao.values()));
        return new FiltroTransacoes(tipos, parametros.inteiroPositivo("player_id").orElse(null));
    }

    private static List<TipoTransacao> lerTipos(String valor) {
        List<TipoTransacao> tipos = Arrays.stream(valor.split(",", -1))
                .map(codigo -> Arrays.stream(TipoTransacao.values())
                        .filter(tipo -> tipo.name().equals(codigo))
                        .findFirst()
                        .orElseThrow(() -> ParametrosConsulta.invalido(PARAMETRO_TIPO)))
                .toList();
        if (tipos.stream().distinct().count() < tipos.size()) {
            throw ParametrosConsulta.invalido(PARAMETRO_TIPO);
        }
        return tipos;
    }
}
