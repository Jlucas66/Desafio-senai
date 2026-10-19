package br.com.passe.dto;

import java.math.BigDecimal;
import java.util.List;

import br.com.passe.common.exception.RequisicaoInvalidaException;
import br.com.passe.common.texto.Textos;
import br.com.passe.common.web.ParametrosConsulta;
import br.com.passe.model.Condicao;
import br.com.passe.model.Posicao;

/**
 * Query params de GET /players já validados ("1. Filtros e query params aceitos" e RN07).
 */
public record FiltroJogadores(
        String busca,
        Posicao posicao,
        Condicao condicao,
        Boolean livre,
        Integer clubeId,
        int idadeMinima,
        int idadeMaxima,
        BigDecimal valorMinimo,
        BigDecimal valorMaximo,
        List<OrdenacaoJogadores> ordenacao,
        int pagina,
        int limite) {

    private static final int IDADE_MINIMA = 16;
    private static final int IDADE_MAXIMA = 45;
    private static final BigDecimal VALOR_MAXIMO = BigDecimal.valueOf(550);
    private static final int BUSCA_TAMANHO_MINIMO = 2;
    private static final int BUSCA_TAMANHO_MAXIMO = 100;
    private static final int LIMITE_PADRAO = 10;
    private static final int LIMITE_MAXIMO = 50;

    public static FiltroJogadores de(ParametrosConsulta parametros) {
        int idadeMinima = parametros.inteiroPositivo("min_age")
                .map(idade -> noIntervalo("min_age", idade, IDADE_MINIMA, IDADE_MAXIMA)).orElse(IDADE_MINIMA);
        int idadeMaxima = parametros.inteiroPositivo("max_age")
                .map(idade -> noIntervalo("max_age", idade, IDADE_MINIMA, IDADE_MAXIMA)).orElse(IDADE_MAXIMA);
        if (idadeMinima > idadeMaxima) {
            throw new RequisicaoInvalidaException("min_age não pode ser maior que max_age.");
        }

        BigDecimal valorMinimo = parametros.decimal("min_value")
                .map(valor -> ateValorMaximo("min_value", valor)).orElse(BigDecimal.ZERO);
        BigDecimal valorMaximo = parametros.decimal("max_value")
                .map(valor -> ateValorMaximo("max_value", valor)).orElse(VALOR_MAXIMO);
        if (valorMinimo.compareTo(valorMaximo) > 0) {
            throw new RequisicaoInvalidaException("min_value não pode ser maior que max_value.");
        }

        Boolean livre = parametros.booleano("free").orElse(null);
        Integer clubeId = parametros.inteiroPositivo("club_id").orElse(null);
        if (Boolean.TRUE.equals(livre) && clubeId != null) {
            throw new RequisicaoInvalidaException("free=true não pode ser combinado com club_id.");
        }

        return new FiltroJogadores(
                parametros.texto("search").map(FiltroJogadores::validarBusca).orElse(null),
                parametros.enumeracao("position", Posicao.class).orElse(null),
                parametros.enumeracao("condition", Condicao.class).orElse(null),
                livre,
                clubeId,
                idadeMinima,
                idadeMaxima,
                valorMinimo,
                valorMaximo,
                parametros.texto("sort").map(OrdenacaoJogadores::ler).orElse(List.of(OrdenacaoJogadores.NAME)),
                parametros.inteiroPositivo("page").orElse(1),
                parametros.inteiroPositivo("limit")
                        .map(limite -> noIntervalo("limit", limite, 1, LIMITE_MAXIMO)).orElse(LIMITE_PADRAO));
    }

    private static String validarBusca(String valor) {
        String busca = Textos.normalizarEspacos(valor);
        if (busca == null || Textos.temCaractereDeControle(busca)
                || Textos.tamanho(busca) < BUSCA_TAMANHO_MINIMO || Textos.tamanho(busca) > BUSCA_TAMANHO_MAXIMO) {
            throw ParametrosConsulta.invalido("search");
        }
        return busca;
    }

    private static int noIntervalo(String nome, int valor, int minimo, int maximo) {
        if (valor < minimo || valor > maximo) {
            throw ParametrosConsulta.invalido(nome);
        }
        return valor;
    }

    private static BigDecimal ateValorMaximo(String nome, BigDecimal valor) {
        if (valor.compareTo(VALOR_MAXIMO) > 0) {
            throw ParametrosConsulta.invalido(nome);
        }
        return valor;
    }
}
