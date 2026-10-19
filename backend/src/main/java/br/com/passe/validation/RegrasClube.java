package br.com.passe.validation;

import java.util.Locale;

import br.com.passe.common.texto.Textos;

/**
 * "Limites de cada campo", acronym: as 3 letras aparecem no nome nessa ordem (sem diferenciar maiúsculas, minúsculas
 * e acentos), a primeira é a primeira letra do nome e as três não são todas iguais.
 */
public final class RegrasClube {

    private RegrasClube() {
    }

    public static boolean siglaCorrespondeAoNome(String sigla, String nome) {
        int[] letrasDaSigla = sigla.toLowerCase(Locale.ROOT).codePoints().toArray();
        if (letrasDaSigla[0] == letrasDaSigla[1] && letrasDaSigla[1] == letrasDaSigla[2]) {
            return false;
        }
        int[] letrasDoNome = Textos.semAcentosEmMinusculas(nome).codePoints().filter(Character::isLetter).toArray();
        if (letrasDoNome.length == 0 || letrasDoNome[0] != letrasDaSigla[0]) {
            return false;
        }
        int encontradas = 1;
        for (int i = 1; i < letrasDoNome.length && encontradas < letrasDaSigla.length; i++) {
            if (letrasDoNome[i] == letrasDaSigla[encontradas]) {
                encontradas++;
            }
        }
        return encontradas == letrasDaSigla.length;
    }
}
