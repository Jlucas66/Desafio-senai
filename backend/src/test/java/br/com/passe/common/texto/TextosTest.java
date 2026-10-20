package br.com.passe.common.texto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;

class TextosTest {

    @Test
    void normalizaEspacosDoInicioDoFimERepetidos() {
        assertThat(Textos.normalizarEspacos("  Meia   Zeta ")).isEqualTo("Meia Zeta");
    }

    @Test
    void textoQueFicaVazioViraAusente() {
        assertThat(Textos.normalizarEspacos("    ")).isNull();
    }

    @Test
    void detectaCaractereDeControle() {
        assertThat(Textos.temCaractereDeControle("Meia\tLua")).isTrue();
        assertThat(Textos.temCaractereDeControle("Meia Lua")).isFalse();
    }

    @Test
    void contaSoPalavrasComLetra() {
        assertThat(Textos.contarPalavras("Ana - Lima")).isEqualTo(2);
        assertThat(Textos.contarPalavras("Ana")).isEqualTo(1);
    }

    @Test
    void ordenaSemAcentosEPelaOrdemUnicode() {
        List<String> ordenados = Stream.of("Gama", "Ana-Maria", "Épsilon", "Delta", "Ana Lima")
                .sorted(Textos::compararNomes)
                .toList();

        assertThat(ordenados).containsExactly("Ana Lima", "Ana-Maria", "Delta", "Épsilon", "Gama");
    }

    @Test
    void nomesQueSoDiferemNoAcentoEmpatam() {
        assertThat(Textos.compararNomes("Águias FC", "Aguias FC")).isZero();
    }

    @Test
    void comparaSemCedilhaEMaiusculas() {
        assertThat(Textos.semAcentosEmMinusculas("João Conceição")).isEqualTo("joao conceicao");
    }
}
