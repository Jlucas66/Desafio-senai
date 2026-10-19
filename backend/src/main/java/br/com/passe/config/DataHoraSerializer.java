package br.com.passe.config;

import java.io.IOException;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import br.com.passe.common.datahora.DataHora;

public class DataHoraSerializer extends StdSerializer<OffsetDateTime> {

    public DataHoraSerializer() {
        super(OffsetDateTime.class);
    }

    @Override
    public void serialize(OffsetDateTime valor, JsonGenerator gerador, SerializerProvider provedor) throws IOException {
        gerador.writeString(DataHora.formatar(valor));
    }
}
