package br.com.passe.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "duelos_partida")
@Getter
@Setter
@NoArgsConstructor
public class DueloPartida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer partidaId;

    private int ordem;

    private Integer clubeAtacanteId;

    private Integer atacanteId;

    private Integer defensorId;

    private String nomeAtacante;

    private String nomeDefensor;

    @Enumerated(EnumType.STRING)
    private Posicao posicaoAtacante;

    @Enumerated(EnumType.STRING)
    private Posicao posicaoDefensor;

    @Enumerated(EnumType.STRING)
    private Condicao condicaoAtacante;

    @Enumerated(EnumType.STRING)
    private Condicao condicaoDefensor;

    private AtributoDuelo atributoAtaque;

    private AtributoDuelo atributoDefesa;

    private int valorAtaque;

    private int valorDefesa;

    private boolean gol;
}
