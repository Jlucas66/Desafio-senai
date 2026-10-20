package br.com.passe.validation;

import br.com.passe.common.datahora.DataHora;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DataHoraBrasiliaValidator implements ConstraintValidator<DataHoraBrasilia, String> {

    @Override
    public boolean isValid(String dataHora, ConstraintValidatorContext contexto) {
        return dataHora == null || DataHora.ler(dataHora).isPresent();
    }
}
