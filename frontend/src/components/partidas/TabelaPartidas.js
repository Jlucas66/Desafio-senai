import { ChevronRight, Plus, Swords } from "lucide-react";
import Link from "next/link";

import { Tabela } from "@/components/ui/Tabela";
import { formatarData, formatarHora } from "@/lib/formatacao";

import { ROTULO_DO_RESULTADO } from "./rotulos";

export function TabelaPartidas({ partidas, carregando, erro, tentarDeNovo, siglaDoClube, aoNova }) {
  const colunas = [
    {
      titulo: "Data e hora",
      conteudo: (partida) => (
        <span className="whitespace-nowrap">
          <span className="text-slate-900">{formatarData(partida.played_at)}</span>
          <span className="ml-2 text-slate-500">{formatarHora(partida.played_at)}</span>
        </span>
      ),
    },
    {
      titulo: "Mandante",
      alinhar: "direita",
      conteudo: (partida) => (
        <span className="inline-flex items-center gap-2">
          <span className={partida.result === "MANDANTE" ? "font-semibold text-slate-900" : "text-slate-700"}>{partida.home.club_name}</span>
          <span className="rounded bg-slate-100 px-1.5 text-xs">{siglaDoClube(partida.home.club_id)}</span>
        </span>
      ),
    },
    {
      titulo: "Placar",
      alinhar: "centro",
      conteudo: (partida) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-900">
          {partida.home.goals} × {partida.away.goals}
        </span>
      ),
    },
    {
      titulo: "Visitante",
      conteudo: (partida) => (
        <span className="inline-flex items-center gap-2">
          <span className="rounded bg-slate-100 px-1.5 text-xs">{siglaDoClube(partida.away.club_id)}</span>
          <span className={partida.result === "VISITANTE" ? "font-semibold text-slate-900" : "text-slate-700"}>{partida.away.club_name}</span>
        </span>
      ),
    },
    {
      titulo: "Resultado",
      conteudo: (partida) => <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-900">{ROTULO_DO_RESULTADO[partida.result]}</span>,
    },
    {
      titulo: "Ações",
      alinhar: "direita",
      conteudo: (partida) => (
        <Link href={`/partidas/${partida.id}`} className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-primaria">
          Ver duelos <ChevronRight className="size-4" aria-hidden />
        </Link>
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      itens={partidas}
      carregando={carregando}
      erro={erro}
      tentarDeNovo={tentarDeNovo}
      tituloDoErro="Não foi possível carregar as partidas"
      vazia={{
        icone: Swords,
        titulo: "Nenhuma partida jogada",
        texto: "Escale os titulares de dois clubes e jogue a primeira partida.",
        acao: aoNova && { rotulo: "Nova partida", icone: Plus, aoClicar: aoNova },
      }}
    />
  );
}
