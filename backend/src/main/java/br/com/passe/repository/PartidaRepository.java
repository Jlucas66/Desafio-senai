package br.com.passe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.model.Partida;

public interface PartidaRepository extends JpaRepository<Partida, Integer> {

    List<Partida> findAllByOrderByJogadaEmDescIdDesc();

    @Query("SELECT p FROM Partida p WHERE p.mandanteId = :clubeId OR p.visitanteId = :clubeId "
            + "ORDER BY p.jogadaEm DESC, p.id DESC")
    List<Partida> findAllDoClube(@Param("clubeId") Integer clubeId);

    default Partida buscar(int id) {
        return findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Partida não encontrada."));
    }
}
