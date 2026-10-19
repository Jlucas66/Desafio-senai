package br.com.passe.service.calculo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.Map;

import br.com.passe.model.Atributos;
import br.com.passe.model.Posicao;

/**
 * RN06, item 2: média ponderada dos seis atributos pelos pesos da posição, arredondada para inteiro (meio para cima).
 */
public final class CalculadoraOverall {

    private record Pesos(int velocidade, int finalizacao, int passe, int drible, int defesa, int fisico) {
    }

    private static final Map<Posicao, Pesos> PESOS_POR_POSICAO = new EnumMap<>(Map.of(
            Posicao.GOL, new Pesos(10, 0, 20, 0, 40, 30),
            Posicao.ZAG, new Pesos(10, 0, 15, 0, 45, 30),
            Posicao.LAT, new Pesos(25, 0, 20, 15, 25, 15),
            Posicao.MEI, new Pesos(10, 15, 35, 25, 5, 10),
            Posicao.ATA, new Pesos(20, 40, 10, 20, 0, 10)));

    private CalculadoraOverall() {
    }

    public static int calcular(Posicao posicao, Atributos atributos) {
        Pesos pesos = PESOS_POR_POSICAO.get(posicao);
        int somaDosProdutos = atributos.velocidade() * pesos.velocidade()
                + atributos.finalizacao() * pesos.finalizacao()
                + atributos.passe() * pesos.passe()
                + atributos.drible() * pesos.drible()
                + atributos.defesa() * pesos.defesa()
                + atributos.fisico() * pesos.fisico();
        return BigDecimal.valueOf(somaDosProdutos)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP)
                .intValueExact();
    }
}
