package br.com.passe.validation;

import br.com.passe.common.texto.Textos;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NomeDeClubeValidator implements ConstraintValidator<NomeDeClube, String> {

    private static final int TAMANHO_MINIMO = 3;
    private static final int TAMANHO_MAXIMO = 60;
    private static final int PALAVRAS_MINIMAS = 2;
    private static final int PALAVRAS_MAXIMAS = 5;

    @Override
    public boolean isValid(String nome, ConstraintValidatorContext contexto) {
        if (nome == null) {
            return true;
        }
        int tamanho = Textos.tamanho(nome);
        long palavras = Textos.contarPalavras(nome);
        return nome.codePoints().allMatch(NomeDeClubeValidator::caracterePermitido)
                && tamanho >= TAMANHO_MINIMO
                && tamanho <= TAMANHO_MAXIMO
                && palavras >= PALAVRAS_MINIMAS
                && palavras <= PALAVRAS_MAXIMAS;
    }

    private static boolean caracterePermitido(int caractere) {
        return Character.isLetter(caractere) || caractere == ' ' || caractere == '-' || caractere == '.';
    }
}
