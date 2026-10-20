package br.com.passe.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "partidas")
@Getter
@Setter
@NoArgsConstructor
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer mandanteId;

    private Integer visitanteId;

    private int golsMandante;

    private int golsVisitante;

    private Formacao formacaoMandante;

    private Formacao formacaoVisitante;

    private OffsetDateTime jogadaEm;
}
