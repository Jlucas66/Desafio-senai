package br.com.passe.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clubes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Clube {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    @JdbcTypeCode(SqlTypes.CHAR)
    private String sigla;

    private BigDecimal caixa;

    private OffsetDateTime criadoEm;
}
