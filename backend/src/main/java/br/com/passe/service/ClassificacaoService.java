package br.com.passe.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.passe.common.texto.Textos;
import br.com.passe.dto.ClassificacaoResponse;
import br.com.passe.model.Clube;
import br.com.passe.model.Partida;
import br.com.passe.repository.ClubeRepository;
import br.com.passe.repository.PartidaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassificacaoService {

    private static final int PONTOS_POR_VITORIA = 3;
    private static final int PONTOS_POR_EMPATE = 1;

    /**
     * RN21, item 4: mais pontos, maior saldo, mais gols marcados, nome em ordem alfabética e, por fim, id.
     */
    private static final Comparator<Campanha> ORDEM_DA_TABELA = Comparator.comparingInt(Campanha::pontos)
            .thenComparingInt(Campanha::saldoDeGols)
            .thenComparingInt(campanha -> campanha.golsMarcados)
            .reversed()
            .thenComparing(campanha -> campanha.clube.getNome(), Textos::compararNomes)
            .thenComparing(campanha -> campanha.clube.getId());

    private final ClubeRepository clubeRepository;
    private final PartidaRepository partidaRepository;

    @Transactional(readOnly = true)
    public List<ClassificacaoResponse> classificar() {
        Map<Integer, Campanha> campanhas =
                clubeRepository.findAll().stream().collect(Collectors.toMap(Clube::getId, Campanha::new));
        for (Partida partida : partidaRepository.findAll()) {
            campanhas.get(partida.getMandanteId()).registrar(partida.getGolsMandante(), partida.getGolsVisitante());
            campanhas.get(partida.getVisitanteId()).registrar(partida.getGolsVisitante(), partida.getGolsMandante());
        }

        List<Campanha> ordenadas = new ArrayList<>(campanhas.values());
        ordenadas.sort(ORDEM_DA_TABELA);
        List<ClassificacaoResponse> tabela = new ArrayList<>();
        for (int i = 0; i < ordenadas.size(); i++) {
            tabela.add(ordenadas.get(i).paraResponse(i + 1));
        }
        return tabela;
    }

    private static final class Campanha {

        private final Clube clube;
        private int vitorias;
        private int empates;
        private int derrotas;
        private int golsMarcados;
        private int golsSofridos;

        private Campanha(Clube clube) {
            this.clube = clube;
        }

        private void registrar(int marcados, int sofridos) {
            golsMarcados += marcados;
            golsSofridos += sofridos;
            if (marcados > sofridos) {
                vitorias++;
            } else if (marcados == sofridos) {
                empates++;
            } else {
                derrotas++;
            }
        }

        private int pontos() {
            return vitorias * PONTOS_POR_VITORIA + empates * PONTOS_POR_EMPATE;
        }

        private int saldoDeGols() {
            return golsMarcados - golsSofridos;
        }

        private ClassificacaoResponse paraResponse(int posicao) {
            return new ClassificacaoResponse(
                    posicao,
                    clube.getId(),
                    clube.getNome(),
                    vitorias + empates + derrotas,
                    vitorias,
                    empates,
                    derrotas,
                    golsMarcados,
                    golsSofridos,
                    saldoDeGols(),
                    pontos());
        }
    }
}
