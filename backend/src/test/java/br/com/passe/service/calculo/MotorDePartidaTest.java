package br.com.passe.service.calculo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import java.util.List;

import org.junit.jupiter.api.Test;

import br.com.passe.model.AtributoDuelo;
import br.com.passe.model.Atributos;
import br.com.passe.model.Condicao;
import br.com.passe.model.Jogador;
import br.com.passe.model.Posicao;

class MotorDePartidaTest {

    private static final int AGUIAS = 1;
    private static final int DELTA = 2;

    @Test
    void jogaOExemploDaRn20() {
        MotorDePartida.Time aguias = new MotorDePartida.Time(
                AGUIAS,
                List.of(
                        jogador(30, "Rui Prado", Posicao.GOL, Condicao.APTO, 50, 50, 77),
                        jogador(32, "Téo Brandão", Posicao.ZAG, Condicao.APTO, 50, 50, 84),
                        jogador(31, "Davi Lins", Posicao.LAT, Condicao.MAL_CONDICIONADO, 50, 74, 66),
                        jogador(33, "Lauro Neves", Posicao.MEI, Condicao.APTO, 82, 50, 50),
                        jogador(34, "Otto Rangel", Posicao.ATA, Condicao.APTO, 50, 50, 50, 75)));
        MotorDePartida.Time delta = new MotorDePartida.Time(
                DELTA,
                List.of(
                        jogador(40, "Ivo Teles", Posicao.GOL, Condicao.APTO, 50, 50, 72),
                        jogador(41, "Hugo Vaz", Posicao.ZAG, Condicao.APTO, 50, 50, 84),
                        jogador(42, "Lino Matos", Posicao.LAT, Condicao.APTO, 50, 79, 63),
                        jogador(43, "Nei Soares", Posicao.MEI, Condicao.APTO, 70, 50, 50),
                        jogador(44, "Ugo Falcão", Posicao.ATA, Condicao.APTO, 50, 50, 50, 81)));

        List<MotorDePartida.Duelo> duelos = MotorDePartida.jogar(aguias, delta);

        assertThat(duelos)
                .extracting(
                        MotorDePartida.Duelo::ordem,
                        duelo -> duelo.atacante().getId(),
                        duelo -> duelo.defensor().getId(),
                        MotorDePartida.Duelo::atributoAtaque,
                        MotorDePartida.Duelo::valorAtaque,
                        MotorDePartida.Duelo::valorDefesa,
                        MotorDePartida.Duelo::gol)
                .containsExactly(
                        tuple(1, 34, 40, AtributoDuelo.SHOOTING, 75, 72, true),
                        tuple(2, 33, 41, AtributoDuelo.PASSING, 82, 84, false),
                        tuple(3, 31, 42, AtributoDuelo.DRIBBLING, 63, 63, false),
                        tuple(4, 44, 30, AtributoDuelo.SHOOTING, 81, 77, true),
                        tuple(5, 43, 32, AtributoDuelo.PASSING, 70, 84, false),
                        tuple(6, 42, 31, AtributoDuelo.DRIBBLING, 79, 56, true));
        assertThat(MotorDePartida.gols(duelos, AGUIAS)).isEqualTo(1);
        assertThat(MotorDePartida.gols(duelos, DELTA)).isEqualTo(2);
    }

    @Test
    void malCondicionadoArredondaOMeioParaCima() {
        MotorDePartida.Time ataque = new MotorDePartida.Time(
                AGUIAS,
                List.of(
                        jogador(1, "Goleiro Um", Posicao.GOL, Condicao.APTO, 50, 50, 50),
                        jogador(2, "Zagueiro Um", Posicao.ZAG, Condicao.APTO, 50, 50, 50),
                        jogador(3, "Zagueiro Dois", Posicao.ZAG, Condicao.APTO, 50, 50, 50),
                        jogador(4, "Meia Um", Posicao.MEI, Condicao.APTO, 50, 50, 50),
                        jogador(5, "Atacante Um", Posicao.ATA, Condicao.MAL_CONDICIONADO, 50, 50, 50, 50)));
        MotorDePartida.Time defesa = new MotorDePartida.Time(
                DELTA,
                List.of(
                        jogador(6, "Goleiro Dois", Posicao.GOL, Condicao.APTO, 50, 50, 43),
                        jogador(7, "Zagueiro Tres", Posicao.ZAG, Condicao.APTO, 50, 50, 50),
                        jogador(8, "Zagueiro Quatro", Posicao.ZAG, Condicao.APTO, 50, 50, 50),
                        jogador(9, "Meia Dois", Posicao.MEI, Condicao.APTO, 50, 50, 50),
                        jogador(10, "Atacante Dois", Posicao.ATA, Condicao.APTO, 50, 50, 50, 50)));

        MotorDePartida.Duelo primeiro = MotorDePartida.jogar(ataque, defesa).get(0);

        assertThat(primeiro.valorAtaque()).isEqualTo(43);
        assertThat(primeiro.gol()).isFalse();
    }

    private static Jogador jogador(
            int id, String nome, Posicao posicao, Condicao condicao, int passe, int drible, int defesa) {
        return jogador(id, nome, posicao, condicao, passe, drible, defesa, 50);
    }

    private static Jogador jogador(
            int id,
            String nome,
            Posicao posicao,
            Condicao condicao,
            int passe,
            int drible,
            int defesa,
            int finalizacao) {
        Jogador jogador = new Jogador();
        jogador.setId(id);
        jogador.setNome(nome);
        jogador.setPosicao(posicao);
        jogador.setCondicao(condicao);
        jogador.setAtributos(new Atributos(50, finalizacao, passe, drible, defesa, 50));
        return jogador;
    }
}
