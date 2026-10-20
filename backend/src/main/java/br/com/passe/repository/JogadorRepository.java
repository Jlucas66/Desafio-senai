package br.com.passe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.passe.common.exception.RecursoNaoEncontradoException;
import br.com.passe.model.Jogador;

public interface JogadorRepository extends JpaRepository<Jogador, Integer> {

    Optional<Jogador> findByIdAndExcluidoEmIsNull(Integer id);

    List<Jogador> findAllByExcluidoEmIsNull();

    List<Jogador> findAllByClubeId(Integer clubeId);

    List<Jogador> findAllByClubeIdIsNotNull();

    long countByClubeId(Integer clubeId);

    default Jogador buscarAtivo(int id) {
        return findByIdAndExcluidoEmIsNull(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Jogador não encontrado."));
    }
}
