package br.com.passe.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FormacaoConverter implements AttributeConverter<Formacao, String> {

    @Override
    public String convertToDatabaseColumn(Formacao formacao) {
        return formacao == null ? null : formacao.getCodigo();
    }

    @Override
    public Formacao convertToEntityAttribute(String codigo) {
        return codigo == null ? null : Formacao.doCodigo(codigo);
    }
}
