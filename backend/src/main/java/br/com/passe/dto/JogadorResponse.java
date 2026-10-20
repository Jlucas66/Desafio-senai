package br.com.passe.dto;

import java.math.BigDecimal;

import br.com.passe.model.Atributos;
import br.com.passe.model.Condicao;
import br.com.passe.model.Jogador;
import br.com.passe.model.Posicao;

public record JogadorResponse(
        Integer id,
        String name,
        Posicao position,
        int agility,
        int age,
        Condicao condition,
        BigDecimal baseValue,
        BigDecimal marketValue,
        int pace,
        int shooting,
        int passing,
        int dribbling,
        int defending,
        int physical,
        int potential,
        int overall,
        Integer clubId) {

    public static JogadorResponse de(Jogador jogador, int overall, BigDecimal valorDeMercado) {
        Atributos atributos = jogador.getAtributos();
        return new JogadorResponse(
                jogador.getId(),
                jogador.getNome(),
                jogador.getPosicao(),
                jogador.getAgilidade(),
                jogador.getIdade(),
                jogador.getCondicao(),
                jogador.getValorBase(),
                valorDeMercado,
                atributos.velocidade(),
                atributos.finalizacao(),
                atributos.passe(),
                atributos.drible(),
                atributos.defesa(),
                atributos.fisico(),
                jogador.getPotencial(),
                overall,
                jogador.getClubeId());
    }
}
