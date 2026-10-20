package br.com.passe.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * "Limites de cada campo", name do clube: 3 a 60 caracteres depois da V4, 2 a 5 palavras e só letras (com ou sem
 * acento), espaços, hífen e ponto.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NomeDeClubeValidator.class)
public @interface NomeDeClube {

    String message() default
            "name deve ter de 3 a 60 caracteres, de 2 a 5 palavras e só letras, espaços, hífen e ponto.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
