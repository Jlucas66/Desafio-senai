package br.com.passe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.passe.model.DueloPartida;

public interface DueloPartidaRepository extends JpaRepository<DueloPartida, Integer> {

    List<DueloPartida> findAllByPartidaIdOrderByOrdem(Integer partidaId);
}
