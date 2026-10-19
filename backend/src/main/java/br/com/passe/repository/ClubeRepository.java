package br.com.passe.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.passe.model.Clube;

public interface ClubeRepository extends JpaRepository<Clube, Integer> {
}
