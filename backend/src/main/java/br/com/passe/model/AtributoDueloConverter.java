package br.com.passe.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AtributoDueloConverter implements AttributeConverter<AtributoDuelo, String> {

    @Override
    public String convertToDatabaseColumn(AtributoDuelo atributo) {
        return atributo == null ? null : atributo.getCodigo();
    }

    @Override
    public AtributoDuelo convertToEntityAttribute(String codigo) {
        return codigo == null ? null : AtributoDuelo.doCodigo(codigo);
    }
}
