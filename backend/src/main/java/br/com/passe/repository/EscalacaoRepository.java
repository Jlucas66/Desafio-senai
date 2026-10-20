package br.com.passe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.passe.model.Escalacao;
import br.com.passe.model.EscalacaoId;

public interface EscalacaoRepository extends JpaRepository<Escalacao, EscalacaoId> {

    List<Escalacao> findAllByIdClubeId(Integer clubeId);

    @Modifying
    @Query("DELETE FROM Escalacao e WHERE e.id.clubeId = :clubeId")
    void removerTodosDoClube(@Param("clubeId") Integer clubeId);

    @Modifying
    @Query("DELETE FROM Escalacao e WHERE e.id.jogadorId = :jogadorId")
    void removerJogador(@Param("jogadorId") Integer jogadorId);
}
