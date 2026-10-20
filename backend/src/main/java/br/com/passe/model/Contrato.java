package br.com.passe.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

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
@Table(name = "contratos")
@Getter
@Setter
@NoArgsConstructor
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer jogadorId;

    private Integer clubeId;

    private BigDecimal valorCompra;

    private OffsetDateTime fidelidadeAte;

    @Enumerated(EnumType.STRING)
    private SituacaoContrato situacao;

    private OffsetDateTime iniciadoEm;

    private OffsetDateTime encerradoEm;
}
