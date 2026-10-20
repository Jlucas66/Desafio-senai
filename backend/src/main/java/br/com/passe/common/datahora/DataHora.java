package br.com.passe.common.datahora;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * RN01: entrada no formato AAAA-MM-DDTHH:MM-03:00, sem ajustar data ou hora inexistente; saída em
 * AAAA-MM-DDTHH:MM:SS-03:00.
 */
public final class DataHora {

    public static final ZoneOffset BRASILIA = ZoneOffset.ofHours(-3);

    private static final Pattern FORMATO_ENTRADA =
            Pattern.compile("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}-03:00");
    private static final DateTimeFormatter ENTRADA =
            DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm").withResolverStyle(ResolverStyle.STRICT);
    private static final DateTimeFormatter SAIDA = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ssxxx");
    private static final int TAMANHO_SEM_FUSO = "AAAA-MM-DDTHH:MM".length();

    private DataHora() {}

    public static Optional<OffsetDateTime> ler(String texto) {
        if (texto == null || !FORMATO_ENTRADA.matcher(texto).matches()) {
            return Optional.empty();
        }
        try {
            LocalDateTime local = LocalDateTime.parse(texto.substring(0, TAMANHO_SEM_FUSO), ENTRADA);
            return Optional.of(local.atOffset(BRASILIA));
        } catch (DateTimeException e) {
            return Optional.empty();
        }
    }

    public static String formatar(OffsetDateTime dataHora) {
        return dataHora.withOffsetSameInstant(BRASILIA).format(SAIDA);
    }
}
