package br.com.passe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.model.Clube;
import jakarta.persistence.LockModeType;

public interface ClubeRepository extends JpaRepository<Clube, Integer> {

    @Query("SELECT count(c) > 0 FROM Clube c WHERE lower(c.nome) = lower(:nome)")
    boolean existeComNome(@Param("nome") String nome);

    boolean existsBySigla(String sigla);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Clube c WHERE c.id = :id")
    Optional<Clube> findByIdParaAtualizar(@Param("id") Integer id);

    default Clube buscar(int id) {
        return findById(id).orElseThrow(ClubeRepository::naoEncontrado);
    }

    default Clube buscarParaAtualizar(int id) {
        return findByIdParaAtualizar(id).orElseThrow(ClubeRepository::naoEncontrado);
    }

    private static RecursoNaoEncontradoException naoEncontrado() {
        return new RecursoNaoEncontradoException("Clube não encontrado.");
    }
}
