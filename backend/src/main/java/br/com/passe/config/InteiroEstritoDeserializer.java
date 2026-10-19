package br.com.passe.config;

import java.io.IOException;
import java.math.BigDecimal;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

/**
 * V2: aceita só número JSON; com ponto decimal, só se a parte fracionária for zero (50.0 vale 50, 50.5 é recusado).
 */
public class InteiroEstritoDeserializer extends StdDeserializer<Integer> {

    public InteiroEstritoDeserializer() {
        super(Integer.class);
    }

    @Override
    public Integer deserialize(JsonParser parser, DeserializationContext contexto) throws IOException {
        return switch (parser.currentToken()) {
            case VALUE_NUMBER_INT -> parser.getIntValue();
            case VALUE_NUMBER_FLOAT -> semParteFracionaria(parser, contexto);
            default -> (Integer) contexto.handleUnexpectedToken(Integer.class, parser);
        };
    }

    private Integer semParteFracionaria(JsonParser parser, DeserializationContext contexto) throws IOException {
        BigDecimal valor = parser.getDecimalValue();
        try {
            return valor.intValueExact();
        } catch (ArithmeticException e) {
            return (Integer) contexto.handleWeirdNumberValue(Integer.class, valor, "deve ser um número inteiro");
        }
    }
}
