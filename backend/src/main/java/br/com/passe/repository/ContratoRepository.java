package br.com.passe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.passe.model.Contrato;
import br.com.passe.model.SituacaoContrato;

public interface ContratoRepository extends JpaRepository<Contrato, Integer> {

    Optional<Contrato> findByJogadorIdAndSituacao(Integer jogadorId, SituacaoContrato situacao);

    List<Contrato> findAllByClubeIdAndSituacao(Integer clubeId, SituacaoContrato situacao);
}
