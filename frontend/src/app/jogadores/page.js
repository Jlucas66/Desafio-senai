"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { FiltrosJogadores } from "@/components/jogadores/FiltrosJogadores";
import { FormularioCadastro } from "@/components/jogadores/FormularioCadastro";
import { FormularioCondicao } from "@/components/jogadores/FormularioCondicao";
import { FormularioEdicao } from "@/components/jogadores/FormularioEdicao";
import { TabelaJogadores } from "@/components/jogadores/TabelaJogadores";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { Campo, Selecao } from "@/components/ui/Campo";
import { Confirmacao } from "@/components/ui/Confirmacao";
import { Paginacao } from "@/components/ui/Paginacao";
import { useAcao } from "@/hooks/useAcao";
import { useCarregamento } from "@/hooks/useCarregamento";
import { JOGADORES_POR_PAGINA, ORDENACOES_DE_JOGADORES } from "@/lib/dominio";
import { listarClubes } from "@/services/clubes";
import { excluirJogador, listarJogadores } from "@/services/jogadores";

export default function PaginaDeJogadores() {
  const [filtros, setFiltros] = useState({});
  const [ordenacao, setOrdenacao] = useState("name");
  const [pagina, setPagina] = useState(1);
  const [janela, setJanela] = useState(null);

  const buscarJogadores = useCallback(
    () => listarJogadores({ ...filtros, sort: ordenacao, page: pagina, limit: JOGADORES_POR_PAGINA }),
    [filtros, ordenacao, pagina],
  );
  const jogadores = useCarregamento(buscarJogadores);
  const clubes = useCarregamento(listarClubes);

  const nomesDosClubes = useMemo(() => new Map((clubes.dados ?? []).map((clube) => [clube.id, clube.name])), [clubes.dados]);

  function fecharJanela() {
    setJanela(null);
  }

  function concluirAcao() {
    setJanela(null);
    jogadores.recarregar();
  }

  const exclusao = useAcao(excluirJogador, { mensagemDeSucesso: "Jogador excluído.", aoConcluir: concluirAcao });

  function aplicarFiltros(novosFiltros) {
    setFiltros(novosFiltros);
    setPagina(1);
  }

  function ordenar(novaOrdenacao) {
    setOrdenacao(novaOrdenacao);
    setPagina(1);
  }

  return (
    <>
      <CabecalhoDaPagina titulo="Jogadores" descricao="Cadastre, filtre e acompanhe o valor de mercado de cada jogador.">
        <Botao onClick={() => setJanela({ tipo: "cadastro" })}>
          <Plus className="size-4" /> Novo jogador
        </Botao>
      </CabecalhoDaPagina>

      <FiltrosJogadores clubes={clubes.dados ?? []} aoAplicar={aplicarFiltros} />

      <div className="mb-3 flex justify-end">
        <div className="w-full sm:w-64">
          <Campo id="ordenacao-jogadores" rotulo="Ordenar por">
            <Selecao id="ordenacao-jogadores" opcoes={ORDENACOES_DE_JOGADORES} value={ordenacao} onChange={(evento) => ordenar(evento.target.value)} />
          </Campo>
        </div>
      </div>

      <TabelaJogadores
        jogadores={jogadores.dados?.data ?? []}
        carregando={jogadores.carregando}
        erro={jogadores.erro}
        nomesDosClubes={nomesDosClubes}
        aoEditar={(jogador) => setJanela({ tipo: "edicao", jogador })}
        aoAlterarCondicao={(jogador) => setJanela({ tipo: "condicao", jogador })}
        aoExcluir={(jogador) => setJanela({ tipo: "exclusao", jogador })}
      />

      {jogadores.dados && (
        <div className="mt-4">
          <Paginacao
            pagina={jogadores.dados.meta.page}
            totalDePaginas={jogadores.dados.meta.total_pages}
            totalDeItens={jogadores.dados.meta.total_items}
            rotuloDosItens="jogadores encontrados"
            aoMudar={setPagina}
          />
        </div>
      )}

      {janela?.tipo === "cadastro" && <FormularioCadastro aoFechar={fecharJanela} aoCadastrar={concluirAcao} />}
      {janela?.tipo === "edicao" && <FormularioEdicao jogador={janela.jogador} aoFechar={fecharJanela} aoEditar={concluirAcao} />}
      {janela?.tipo === "condicao" && <FormularioCondicao jogador={janela.jogador} aoFechar={fecharJanela} aoAlterar={concluirAcao} />}
      {janela?.tipo === "exclusao" && (
        <Confirmacao
          titulo="Excluir jogador"
          mensagem={`Excluir ${janela.jogador.name}? Ele sai da lista de jogadores, mas continua no histórico de transações e nas partidas já jogadas.`}
          rotuloDaAcao="Excluir"
          variante="perigo"
          enviando={exclusao.enviando}
          aoConfirmar={() => exclusao.executar(janela.jogador.id)}
          aoCancelar={fecharJanela}
        />
      )}
    </>
  );
}
