package br.com.passe.service.calculo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import br.com.passe.model.AtributoDuelo;
import br.com.passe.model.Atributos;
import br.com.passe.model.Condicao;
import br.com.passe.model.Jogador;

/**
 * RN20: os 6 duelos da partida, sem sorteio. Cada time traz os 5 titulares na ordem do elenco: o goleiro (índice 0) e
 * os jogadores de linha do 1º (índice 1, o mais recuado) ao 4º (índice 4, o mais avançado).
 */
public final class MotorDePartida {

    public record Time(Integer clubeId, List<Jogador> titulares) {}

    public record Duelo(
            int ordem,
            Integer clubeAtacanteId,
            Jogador atacante,
            Jogador defensor,
            AtributoDuelo atributoAtaque,
            int valorAtaque,
            int valorDefesa,
            boolean gol) {}

    private record Confronto(int atacante, int defensor) {}

    private static final List<Confronto> CONFRONTOS =
            List.of(new Confronto(4, 0), new Confronto(3, 1), new Confronto(2, 2));
    private static final BigDecimal FATOR_MAL_CONDICIONADO = new BigDecimal("0.85");

    private MotorDePartida() {}

    public static List<Duelo> jogar(Time mandante, Time visitante) {
        List<Duelo> duelos = new ArrayList<>(atacar(mandante, visitante, 1));
        duelos.addAll(atacar(visitante, mandante, CONFRONTOS.size() + 1));
        return duelos;
    }

    public static int gols(List<Duelo> duelos, Integer clubeId) {
        return (int) duelos.stream()
                .filter(duelo -> duelo.gol() && duelo.clubeAtacanteId().equals(clubeId))
                .count();
    }

    private static List<Duelo> atacar(Time ataque, Time defesa, int primeiraOrdem) {
        List<Duelo> duelos = new ArrayList<>();
        for (int i = 0; i < CONFRONTOS.size(); i++) {
            Confronto confronto = CONFRONTOS.get(i);
            Jogador atacante = ataque.titulares().get(confronto.atacante());
            Jogador defensor = defesa.titulares().get(confronto.defensor());
            AtributoDuelo atributoAtaque = atributoDeAtaque(atacante);
            int valorAtaque = valorNoDuelo(atacante, atributoAtaque);
            int valorDefesa = valorNoDuelo(defensor, AtributoDuelo.DEFENDING);
            duelos.add(new Duelo(
                    primeiraOrdem + i,
                    ataque.clubeId(),
                    atacante,
                    defensor,
                    atributoAtaque,
                    valorAtaque,
                    valorDefesa,
                    valorAtaque > valorDefesa));
        }
        return duelos;
    }

    private static AtributoDuelo atributoDeAtaque(Jogador atacante) {
        return switch (atacante.getPosicao()) {
            case ATA -> AtributoDuelo.SHOOTING;
            case MEI -> AtributoDuelo.PASSING;
            case ZAG, LAT -> AtributoDuelo.DRIBBLING;
            case GOL -> throw new IllegalArgumentException("O goleiro não ataca nos duelos.");
        };
    }

    private static int valorNoDuelo(Jogador jogador, AtributoDuelo atributo) {
        Atributos atributos = jogador.getAtributos();
        int valor =
                switch (atributo) {
                    case SHOOTING -> atributos.finalizacao();
                    case PASSING -> atributos.passe();
                    case DRIBBLING -> atributos.drible();
                    case DEFENDING -> atributos.defesa();
                };
        if (jogador.getCondicao() != Condicao.MAL_CONDICIONADO) {
            return valor;
        }
        return BigDecimal.valueOf(valor)
                .multiply(FATOR_MAL_CONDICIONADO)
                .setScale(0, RoundingMode.HALF_UP)
                .intValueExact();
    }
}
