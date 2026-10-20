package br.com.passe.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Embedded;
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
@Table(name = "jogadores")
@Getter
@Setter
@NoArgsConstructor
public class Jogador {

    public static final int IDADE_MAXIMA_JOVEM_PROMESSA = 21;
    public static final BigDecimal VALOR_MINIMO = new BigDecimal("1.00");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private Posicao posicao;

    private int agilidade;

    private int idade;

    private BigDecimal valorBase;

    @Enumerated(EnumType.STRING)
    private Condicao condicao;

    private Integer clubeId;

    @Embedded
    private Atributos atributos;

    private int potencial;

    private OffsetDateTime excluidoEm;

    private OffsetDateTime criadoEm;

    private OffsetDateTime atualizadoEm;

    public boolean estaLivre() {
        return clubeId == null;
    }
}
