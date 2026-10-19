package br.com.passe.common.texto;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.regex.Pattern;

public final class Textos {

    private static final Pattern ESPACOS_NAS_PONTAS = Pattern.compile("^ +| +$");
    private static final Pattern ESPACOS_REPETIDOS = Pattern.compile(" {2,}");
    private static final Pattern MARCAS_DE_ACENTO = Pattern.compile("\\p{Mn}");

    private Textos() {
    }

    public static String normalizarEspacos(String texto) {
        if (texto == null) {
            return null;
        }
        String semPontas = ESPACOS_NAS_PONTAS.matcher(texto).replaceAll("");
        String normalizado = ESPACOS_REPETIDOS.matcher(semPontas).replaceAll(" ");
        return normalizado.isEmpty() ? null : normalizado;
    }

    public static boolean temCaractereDeControle(String texto) {
        return texto.codePoints().anyMatch(caractere -> Character.getType(caractere) == Character.CONTROL);
    }

    public static int tamanho(String texto) {
        return texto.codePointCount(0, texto.length());
    }

    public static long contarPalavras(String texto) {
        return Arrays.stream(texto.split(" "))
                .filter(parte -> parte.codePoints().anyMatch(Character::isLetter))
                .count();
    }

    public static boolean temDigito(String texto) {
        return texto.chars().anyMatch(caractere -> caractere >= '0' && caractere <= '9');
    }

    public static String semAcentosEmMinusculas(String texto) {
        String decomposto = Normalizer.normalize(texto.toLowerCase(Locale.ROOT), Normalizer.Form.NFD);
        return MARCAS_DE_ACENTO.matcher(decomposto).replaceAll("");
    }

    public static int compararNomes(String nome, String outro) {
        return Arrays.compare(
                semAcentosEmMinusculas(nome).codePoints().toArray(),
                semAcentosEmMinusculas(outro).codePoints().toArray());
    }
}
