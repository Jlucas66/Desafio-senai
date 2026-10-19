package br.com.passe.service;

import java.util.Comparator;

import org.springframework.stereotype.Component;

import br.com.passe.common.texto.Textos;
import br.com.passe.dto.JogadorResponse;
import br.com.passe.model.Jogador;
import br.com.passe.service.calculo.CalculadoraOverall;
import br.com.passe.service.calculo.CalculadoraValorMercado;

@Component
public class JogadorMapper {

    /**
     * RN11: ordem do elenco por posição (GOL, ZAG, LAT, MEI, ATA), depois pelo nome e depois pelo id.
     */
    public static final Comparator<Jogador> ORDEM_DO_ELENCO = Comparator.comparing(Jogador::getPosicao)
            .thenComparing(Jogador::getNome, Textos::compararNomes)
            .thenComparing(Jogador::getId);

    public JogadorResponse paraResponse(Jogador jogador) {
        return JogadorResponse.de(
                jogador,
                CalculadoraOverall.calcular(jogador.getPosicao(), jogador.getAtributos()),
                CalculadoraValorMercado.calcular(jogador));
    }
}
