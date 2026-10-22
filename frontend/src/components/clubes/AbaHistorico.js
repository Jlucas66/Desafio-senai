"use client";

import { BadgePercent, Check, Download, HandCoins, History, ShoppingCart, TrendingDown, TrendingUp, TriangleAlert, User } from "lucide-react";
import { useCallback, useState } from "react";

import { Alerta } from "@/components/ui/Alerta";
import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Avatar } from "@/components/ui/Avatar";
import { Botao } from "@/components/ui/Botao";
import { Cartao } from "@/components/ui/Cartao";
import { ItemDoMenu, Menu, TituloDoMenu } from "@/components/ui/Menu";
import { Tabela } from "@/components/ui/Tabela";
import { useAvisos } from "@/contexts/AvisosContext";
import { useAcao } from "@/hooks/useAcao";
import { useCarregamento } from "@/hooks/useCarregamento";
import { salvarArquivo } from "@/lib/arquivo";
import { formatarComSinal, formatarData, formatarHora, formatarMoeda } from "@/lib/formatacao";
import { exportarTransacoes, listarTransacoes } from "@/services/clubes";

const TIPOS = [
  { valor: "COMPRA", rotulo: "Compra", icone: ShoppingCart },
  { valor: "VENDA", rotulo: "Venda", icone: HandCoins },
];

function corDoValor(valor) {
  if (valor > 0) {
    return "text-emerald-700";
  }
  return valor < 0 ? "text-red-600" : "text-slate-900";
}

const COLUNAS = [
  {
    titulo: "Data e hora",
    conteudo: (transacao) => (
      <span className="whitespace-nowrap">
        <span className="text-slate-900">{formatarData(transacao.created_at)}</span>
        <span className="ml-2 text-slate-500">{formatarHora(transacao.created_at)}</span>
      </span>
    ),
  },
  {
    titulo: "Tipo",
    conteudo: (transacao) => {
      const tipo = TIPOS.find((item) => item.valor === transacao.type);
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 text-xs text-slate-900">
          <tipo.icone className="size-3" aria-hidden /> {tipo.rotulo}
        </span>
      );
    },
  },
  {
    titulo: "Jogador",
    conteudo: (transacao) => (
      <span className="flex items-center gap-3">
        <Avatar nome={transacao.player_name} />
        <span className="font-medium text-slate-900">{transacao.player_name}</span>
      </span>
    ),
  },
  { titulo: "Valor", alinhar: "direita", conteudo: (transacao) => formatarMoeda(transacao.value) },
  { titulo: "Taxa ou comissão", alinhar: "direita", conteudo: (transacao) => formatarMoeda(transacao.fee) },
  { titulo: "Multa", alinhar: "direita", conteudo: (transacao) => formatarMoeda(transacao.penalty) },
  {
    titulo: "Lucro",
    alinhar: "direita",
    conteudo: (transacao) => <span className={transacao.profit === null ? "text-slate-500" : corDoValor(transacao.profit)}>{formatarComSinal(transacao.profit)}</span>,
  },
  {
    titulo: "Variação do caixa",
    alinhar: "direita",
    conteudo: (transacao) => <span className={`font-semibold ${corDoValor(transacao.cash_change)}`}>{formatarComSinal(transacao.cash_change)}</span>,
  },
];

function Resumo({ resumo }) {
  const itens = [
    { rotulo: "Total pago em compras", valor: formatarMoeda(resumo.total_spent), legenda: "Valor + taxa", icone: ShoppingCart },
    { rotulo: "Total recebido em vendas", valor: formatarMoeda(resumo.total_received), legenda: "Crédito líquido", icone: HandCoins },
    { rotulo: "Taxas e comissões", valor: formatarMoeda(resumo.total_fees), legenda: "Somadas", icone: BadgePercent },
    { rotulo: "Multas", valor: formatarMoeda(resumo.total_penalties), legenda: "Por fidelidade", icone: TriangleAlert },
    {
      rotulo: "Lucro total",
      valor: <span className={corDoValor(resumo.total_profit)}>{formatarComSinal(resumo.total_profit)}</span>,
      legenda: "Soma dos lucros, com sinal",
      icone: resumo.total_profit < 0 ? TrendingDown : TrendingUp,
    },
  ];
  return (
    <dl className="grid divide-slate-200 border-t border-slate-200 bg-slate-50 sm:grid-cols-5 sm:divide-x">
      {itens.map((item) => (
        <div key={item.rotulo} className="px-4 py-3">
          <dt className="flex items-center gap-1.5 text-xs text-slate-600">
            <item.icone className="size-3.5" aria-hidden /> {item.rotulo}
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{item.valor}</dd>
          <dd className="text-xs text-slate-500">{item.legenda}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AbaHistorico({ clubeId, jogadoresDoHistorico }) {
  const avisos = useAvisos();
  const [tipos, setTipos] = useState(["COMPRA", "VENDA"]);
  const [jogadorId, setJogadorId] = useState("");
  const filtros = { type: tipos.join(","), player_id: jogadorId };
  const filtrosAlterados = tipos.length < TIPOS.length || jogadorId !== "";

  const buscar = useCallback(
    () => listarTransacoes(clubeId, { type: tipos.join(","), player_id: jogadorId }),
    [clubeId, tipos, jogadorId],
  );
  const historico = useCarregamento(buscar);
  const exportacao = useAcao(
    () => exportarTransacoes(clubeId, filtros),
    (arquivo) => {
      salvarArquivo(arquivo);
      const filtroDeTipo = tipos.length === 1 ? `, com o filtro de tipo ${TIPOS.find((tipo) => tipo.valor === tipos[0]).rotulo} aplicado` : "";
      avisos.sucesso("CSV baixado", `${arquivo.nomeDoArquivo}${filtroDeTipo}.`);
    },
    { atualizarDados: false },
  );

  function alternarTipo(tipo) {
    // Pelo menos um tipo fica marcado: sem nenhum, o histórico mostraria tudo, o que confundiria o filtro.
    if (tipos.includes(tipo) && tipos.length === 1) {
      return;
    }
    setTipos(tipos.includes(tipo) ? tipos.filter((item) => item !== tipo) : TIPOS.map((item) => item.valor).filter((valor) => valor === tipo || tipos.includes(valor)));
  }

  const nomeDoJogador = jogadoresDoHistorico.find((jogador) => String(jogador.id) === jogadorId)?.nome;
  const filtroRecusado = historico.erro && [400, 404].includes(historico.erro.status);

  return (
    <Cartao
      titulo="Histórico de transações"
      descricao="Da mais recente para a mais antiga, com o nome e os valores do momento de cada operação."
      acoes={
        <Botao variante="secundario" onClick={exportacao.executar} carregando={exportacao.enviando}>
          {!exportacao.enviando && <Download className="size-4" />} Exportar CSV
        </Botao>
      }
    >
      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        <span className="mr-1 text-sm text-slate-600">Tipo</span>
        {TIPOS.map((tipo) => {
          const marcado = tipos.includes(tipo.valor);
          return (
            <button
              key={tipo.valor}
              type="button"
              role="checkbox"
              aria-checked={marcado}
              onClick={() => alternarTipo(tipo.valor)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${
                marcado ? "border-primaria bg-blue-50 text-primaria" : "border-slate-300 text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className={`flex size-4 items-center justify-center rounded border ${marcado ? "border-primaria bg-primaria text-white" : "border-slate-400"}`}>
                {marcado && <Check className="size-3" aria-hidden />}
              </span>
              {tipo.rotulo}
            </button>
          );
        })}
        <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
        <Menu icone={User} rotulo={`Jogador: ${nomeDoJogador ?? "todos"}`} largura="w-64">
          <TituloDoMenu>Jogadores do histórico</TituloDoMenu>
          <ItemDoMenu selecionado={jogadorId === ""} onClick={() => setJogadorId("")}>
            Todos
          </ItemDoMenu>
          {jogadoresDoHistorico.map((jogador) => (
            <ItemDoMenu key={jogador.id} selecionado={String(jogador.id) === jogadorId} onClick={() => setJogadorId(String(jogador.id))}>
              {jogador.nome}
            </ItemDoMenu>
          ))}
        </Menu>
        {filtrosAlterados && (
          <Botao
            variante="link"
            className="ml-2"
            onClick={() => {
              setTipos(TIPOS.map((tipo) => tipo.valor));
              setJogadorId("");
            }}
          >
            Limpar filtros
          </Botao>
        )}
      </div>
      {exportacao.erro && (
        <div className="px-5 pb-4">
          <AlertaDeErro erro={exportacao.erro} titulo="Não foi possível exportar o CSV" />
        </div>
      )}
      {filtroRecusado ? (
        <div className="border-t border-slate-200 p-5">
          <Alerta tipo="erro" titulo="O filtro foi recusado">
            {historico.erro.message}
          </Alerta>
        </div>
      ) : (
        <>
          <Tabela
            colunas={COLUNAS}
            itens={historico.dados?.data ?? []}
            carregando={historico.carregando}
            erro={historico.erro}
            tentarDeNovo={historico.tentarDeNovo}
            tituloDoErro="Não foi possível carregar o histórico"
            vazia={{
              icone: History,
              titulo: filtrosAlterados ? "Nenhuma transação com esses filtros" : "Nenhuma compra ou venda",
              texto: "As compras e vendas do clube aparecem aqui, com os totais.",
            }}
          />
          {historico.dados && <Resumo resumo={historico.dados.summary} />}
        </>
      )}
    </Cartao>
  );
}
