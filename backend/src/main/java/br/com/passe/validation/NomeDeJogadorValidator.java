package br.com.passe.validation;

import br.com.passe.common.texto.Textos;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NomeDeJogadorValidator implements ConstraintValidator<NomeDeJogador, String> {

    private static final int TAMANHO_MINIMO = 3;
    private static final int TAMANHO_MAXIMO = 100;
    private static final int PALAVRAS_MINIMAS = 2;

    @Override
    public boolean isValid(String nome, ConstraintValidatorContext contexto) {
        if (nome == null) {
            return true;
        }
        int tamanho = Textos.tamanho(nome);
        return !Textos.temCaractereDeControle(nome)
                && tamanho >= TAMANHO_MINIMO
                && tamanho <= TAMANHO_MAXIMO
                && Textos.contarPalavras(nome) >= PALAVRAS_MINIMAS
                && !Textos.temDigito(nome);
    }
}
