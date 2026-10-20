package br.com.passe.model;

import java.time.OffsetDateTime;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "escalacoes")
@Getter
@Setter
@NoArgsConstructor
public class Escalacao {

    @EmbeddedId
    private EscalacaoId id;

    private OffsetDateTime criadoEm;
}
