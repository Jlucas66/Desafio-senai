"use client";

import { ArrowUpDown, Plus, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

import { ConfirmacaoExclusao } from "@/components/jogadores/ConfirmacaoExclusao";
import { FILTROS_VAZIOS, FiltrosAtivos, FiltrosJogadores } from "@/components/jogadores/FiltrosJogadores";
import { FormularioCadastro } from "@/components/jogadores/FormularioCadastro";
import { FormularioCondicao } from "@/components/jogadores/FormularioCondicao";
import { FormularioEdicao } from "@/components/jogadores/FormularioEdicao";
import { PainelDeDetalhes } from "@/components/jogadores/PainelDeDetalhes";
import { ResultadoCadastro } from "@/components/jogadores/ResultadoCadastro";
import { TabelaJogadores } from "@/components/jogadores/TabelaJogadores";
import { FormularioCompra } from "@/components/mercado/FormularioCompra";
import { ResultadoCompra } from "@/components/mercado/ResultadoCompra";
import { AbasSegmentadas } from "@/components/ui/Abas";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { ItemDoMenu, Menu, TituloDoMenu } from "@/components/ui/Menu";
import { Paginacao } from "@/components/ui/Paginacao";
import { useAvisos } from "@/contexts/AvisosContext";
import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";
import { useCarregamento } from "@/hooks/useCarregamento";
import { JOGADORES_POR_PAGINA, ORDENACOES_DE_JOGADORES, rotuloDaCondicao } from "@/lib/dominio";
import { formatarMoeda, plural } from "@/lib/formatacao";
import { listarJogadores } from "@/services/jogadores";

const SITUACAO_DA_ABA = { todos: "", livres: true, "em-clubes": false };

function PaginaDeJogadores() {
  const parametrosDaUrl = useSearchParams();
  const avisos = useAvisos();
  const { clubes } = useResumoDaLiga();
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [aba, setAba] = useState(parametrosDaUrl.get("aba") === "livres" ? "livres" : "todos");
  const [ordenacao, setOrdenacao] = useState("name");
  const [pagina, setPagina] = useState(1);
  const [janela, setJanela] = useState(null);
  const [destaque, setDestaque] = useState(null);

  const buscarJogadores = useCallback(
    () => listarJogadores({ ...filtros, free: SITUACAO_DA_ABA[aba], sort: ordenacao, page: pagina, limit: JOGADORES_POR_PAGINA }),
    [filtros, aba, ordenacao, pagina],
  );
  const jogadores = useCarregamento(buscarJogadores);

  // Os contadores das abas são o total_items que a API devolve para cada situação, com os mesmos filtros.
  const buscarContadores = useCallback(async () => {
    const total = (situacao) => listarJogadores({ ...filtros, free: situacao, limit: 1 }).then((resposta) => resposta.meta.total_items);
    const [todos, livres, emClubes] = await Promise.all([total(""), filtros.club_id ? null : total(true), total(false)]);
    return { todos, livres, emClubes };
  }, [filtros]);
  const contadores = useCarregamento(buscarContadores);

  const nomeDoClube = (id) => clubes.find((clube) => clube.id === id)?.name ?? `Clube ${id}`;

  function mudarFiltros(novos) {
    setFiltros(novos);
    setPagina(1);
  }

  function mudarAba(novaAba) {
    setAba(novaAba);
    setPagina(1);
    if (novaAba === "livres" && filtros.club_id) {
      mudarFiltros({ ...filtros, club_id: "" });
    }
  }

  function fechar() {
    setJanela(null);
  }

  const acoes = {
    detalhar: (jogador) => setJanela({ tipo: "detalhes", jogador }),
    editar: (jogador) => setJanela({ tipo: "edicao", jogador }),
    alterarCondicao: (jogador) => setJanela({ tipo: "condicao", jogador }),
    excluir: (jogador) => setJanela({ tipo: "exclusao", jogador }),
    comprar: (jogador) => setJanela({ tipo: "compra", jogador }),
  };

  const meta = jogadores.dados?.meta;
  const primeiro = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const ultimo = meta ? Math.min(meta.page * meta.limit, meta.total_items) : 0;
  const ordenacaoAtual = ORDENACOES_DE_JOGADORES.find((item) => item.valor === ordenacao);

  return (
    <>
      <CabecalhoDaPagina icone={Users} titulo="Jogadores" descricao="Cadastre jogadores, acompanhe os indicadores e compre os que estão livres.">
        <Botao onClick={() => setJanela({ tipo: "cadastro" })}>
          <Plus className="size-4" /> Novo jogador
        </Botao>
      </CabecalhoDaPagina>

      <FiltrosJogadores filtros={filtros} aoMudar={mudarFiltros} clubes={clubes} clubeIndisponivel={aba === "livres"} />
      <FiltrosAtivos filtros={filtros} aoMudar={mudarFiltros} clubes={clubes} />

      <section className="rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <AbasSegmentadas
            selecionada={aba}
            aoSelecionar={mudarAba}
            abas={[
              { valor: "todos", rotulo: "Todos", contador: contadores.dados?.todos },
              { valor: "livres", rotulo: "Livres", contador: contadores.dados?.livres ?? undefined, desabilitada: Boolean(filtros.club_id) },
              { valor: "em-clubes", rotulo: "Em clubes", contador: contadores.dados?.emClubes },
            ]}
          />
          <Menu icone={ArrowUpDown} rotulo={`Ordenar: ${ordenacaoAtual.curto}`} alinhamento="direita" largura="w-64">
            <TituloDoMenu>Ordenar por</TituloDoMenu>
            {ORDENACOES_DE_JOGADORES.map((opcao) => (
              <ItemDoMenu
                key={opcao.valor}
                selecionado={opcao.valor === ordenacao}
                onClick={() => {
                  setOrdenacao(opcao.valor);
                  setPagina(1);
                }}
              >
                {opcao.rotulo}
              </ItemDoMenu>
            ))}
          </Menu>
        </div>
        <TabelaJogadores
          jogadores={jogadores.dados?.data ?? []}
          carregando={jogadores.carregando}
          erro={jogadores.erro}
          tentarDeNovo={jogadores.tentarDeNovo}
          clubes={clubes}
          semFiltros={aba === "todos" && Object.values(filtros).every((valor) => !valor)}
          aoNovo={() => setJanela({ tipo: "cadastro" })}
          acoes={acoes}
          destaque={destaque}
        />
        {meta && meta.total_items > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <p>
              Mostrando {primeiro}–{ultimo} de {plural(meta.total_items, "jogador", "jogadores")}
            </p>
            <Paginacao pagina={meta.page} totalDePaginas={meta.total_pages} aoMudar={setPagina} />
          </div>
        )}
      </section>

      {janela?.tipo === "cadastro" && (
        <FormularioCadastro
          aoFechar={fechar}
          aoCadastrar={(jogador) => {
            setDestaque(jogador.id);
            setJanela({ tipo: "cadastrado", jogador });
          }}
        />
      )}
      {janela?.tipo === "cadastrado" && (
        <ResultadoCadastro jogador={janela.jogador} aoFechar={fechar} aoVerDetalhes={() => setJanela({ tipo: "detalhes", jogador: janela.jogador })} />
      )}
      {janela?.tipo === "detalhes" && (
        <PainelDeDetalhes jogador={janela.jogador} nomeDoClube={nomeDoClube(janela.jogador.club_id)} aoFechar={fechar} acoes={acoes} />
      )}
      {janela?.tipo === "edicao" && (
        <FormularioEdicao
          jogador={janela.jogador}
          aoFechar={fechar}
          aoEditar={(jogador) => {
            fechar();
            setDestaque(jogador.id);
            avisos.sucesso("Jogador atualizado", `Os dados de ${jogador.name} foram salvos.`);
          }}
        />
      )}
      {janela?.tipo === "condicao" && (
        <FormularioCondicao
          jogador={janela.jogador}
          nomeDoClube={nomeDoClube(janela.jogador.club_id)}
          aoFechar={fechar}
          aoAlterar={(jogador) => {
            fechar();
            setDestaque(jogador.id);
            avisos.sucesso(
              "Condição alterada",
              `${jogador.name} agora está ${rotuloDaCondicao(jogador.condition)}. Valor de mercado: ${formatarMoeda(jogador.market_value)}.`,
            );
          }}
        />
      )}
      {janela?.tipo === "exclusao" && (
        <ConfirmacaoExclusao
          jogador={janela.jogador}
          aoFechar={fechar}
          aoExcluir={() => {
            fechar();
            avisos.sucesso("Jogador excluído", `${janela.jogador.name} saiu da lista. Transações e partidas antigas dele continuam gravadas.`);
          }}
        />
      )}
      {janela?.tipo === "compra" && (
        <FormularioCompra
          jogador={janela.jogador}
          clubes={clubes}
          clubeInicial={parametrosDaUrl.get("clube")}
          aoFechar={fechar}
          aoComprar={(compra) => setJanela({ tipo: "comprado", compra })}
        />
      )}
      {janela?.tipo === "comprado" && (
        <ResultadoCompra compra={janela.compra} nomeDoClube={nomeDoClube(janela.compra.club_id)} aoFechar={fechar} />
      )}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <PaginaDeJogadores />
    </Suspense>
  );
}
