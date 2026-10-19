package br.com.passe.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * RN01: data e hora no formato AAAA-MM-DDTHH:MM-03:00, existente no calendário.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DataHoraBrasiliaValidator.class)
public @interface DataHoraBrasilia {

    String message() default "Data e hora devem estar no formato AAAA-MM-DDTHH:MM-03:00.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
