package br.com.passe.common.web;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import br.com.passe.common.exception.RequisicaoInvalidaException;

/**
 * Leitura dos query params conforme "1. Filtros e query params aceitos": ausente não filtra, vazio ou fora do
 * formato é recusado com 400.
 */
public final class ParametrosConsulta {

    private static final Pattern INTEIRO_POSITIVO = Pattern.compile("[1-9][0-9]*");
    private static final Pattern DECIMAL = Pattern.compile("(0|[1-9][0-9]*)(\\.[0-9]{1,2})?");

    private final Map<String, String> valores;

    public ParametrosConsulta(Map<String, String> valores) {
        this.valores = valores;
    }

    public static RequisicaoInvalidaException invalido(String nome) {
        return new RequisicaoInvalidaException("Parâmetro inválido: " + nome + ".");
    }

    public Optional<String> texto(String nome) {
        String valor = valores.get(nome);
        if (valor == null) {
            return Optional.empty();
        }
        if (valor.isEmpty()) {
            throw invalido(nome);
        }
        return Optional.of(valor);
    }

    public Optional<Integer> inteiroPositivo(String nome) {
        return texto(nome).map(valor -> {
            if (!INTEIRO_POSITIVO.matcher(valor).matches()) {
                throw invalido(nome);
            }
            try {
                return Integer.valueOf(valor);
            } catch (NumberFormatException e) {
                throw invalido(nome);
            }
        });
    }

    public Optional<BigDecimal> decimal(String nome) {
        return texto(nome).map(valor -> {
            if (!DECIMAL.matcher(valor).matches()) {
                throw invalido(nome);
            }
            return new BigDecimal(valor);
        });
    }

    public Optional<Boolean> booleano(String nome) {
        return texto(nome).map(valor -> switch (valor) {
            case "true" -> true;
            case "false" -> false;
            default -> throw invalido(nome);
        });
    }

    public <E extends Enum<E>> Optional<E> enumeracao(String nome, Class<E> tipo) {
        return texto(nome).map(valor -> Arrays.stream(tipo.getEnumConstants())
                .filter(constante -> constante.name().equals(valor))
                .findFirst()
                .orElseThrow(() -> invalido(nome)));
    }
}
