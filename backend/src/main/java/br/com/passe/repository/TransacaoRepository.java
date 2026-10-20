package br.com.passe.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.passe.model.TipoTransacao;
import br.com.passe.model.Transacao;

public interface TransacaoRepository extends JpaRepository<Transacao, Integer> {

    boolean existsByClubeIdAndJogadorIdAndTipo(Integer clubeId, Integer jogadorId, TipoTransacao tipo);

    List<Transacao> findAllByClubeIdAndTipoInOrderByCriadoEmDescIdDesc(
            Integer clubeId, Collection<TipoTransacao> tipos);

    List<Transacao> findAllByClubeIdAndJogadorIdAndTipoInOrderByCriadoEmDescIdDesc(
            Integer clubeId, Integer jogadorId, Collection<TipoTransacao> tipos);
}
