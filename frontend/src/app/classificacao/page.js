"use client";

import { ArrowRight, ListOrdered, Plus, ShieldHalf } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

import { Cartao } from "@/components/ui/Cartao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { Tabela } from "@/components/ui/Tabela";
import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";
import { useCarregamento } from "@/hooks/useCarregamento";
import { formatarDataHora } from "@/lib/formatacao";
import { buscarClassificacao } from "@/services/liga";

const PARTIDAS_RECENTES = 3;
const CRITERIOS = ["Mais pontos", "Maior saldo de gols", "Mais gols marcados", "Nome do clube, de A a Z"];

function numero(valor) {
  return <span className={valor === 0 ? "text-slate-500" : "text-slate-900"}>{valor}</span>;
}

export default function PaginaDeClassificacao() {
  const { clubes, partidas } = useResumoDaLiga();
  const buscar = useCallback(() => buscarClassificacao(), []);
  const classificacao = useCarregamento(buscar);
  const siglaDoClube = (id) => clubes.find((clube) => clube.id === id)?.acronym ?? "";

  const colunas = [
    {
      titulo: "#",
      conteudo: (linha) => (
        <span
          className={`inline-flex size-6 items-center justify-center rounded-md text-xs font-medium ${
            linha.position === 1 ? "bg-primaria text-white" : "border border-slate-200 text-slate-900"
          }`}
        >
          {linha.position}
        </span>
      ),
    },
    {
      titulo: "Clube",
      conteudo: (linha) => (
        <span className="flex items-center gap-2">
          <span className="rounded bg-slate-100 px-1.5 text-xs font-medium">{siglaDoClube(linha.club_id)}</span>
          <Link href={`/clubes/${linha.club_id}`} className="text-slate-900 underline underline-offset-2">
            {linha.club_name}
          </Link>
        </span>
      ),
    },
    { titulo: "J", alinhar: "centro", conteudo: (linha) => numero(linha.played) },
    { titulo: "V", alinhar: "centro", conteudo: (linha) => numero(linha.wins) },
    { titulo: "E", alinhar: "centro", conteudo: (linha) => numero(linha.draws) },
    { titulo: "D", alinhar: "centro", conteudo: (linha) => numero(linha.losses) },
    { titulo: "GP", alinhar: "centro", conteudo: (linha) => numero(linha.goals_for) },
    { titulo: "GC", alinhar: "centro", conteudo: (linha) => numero(linha.goals_against) },
    {
      titulo: "SG",
      alinhar: "centro",
      conteudo: (linha) => numero(linha.goal_difference > 0 ? `+${linha.goal_difference}` : linha.goal_difference),
    },
    { titulo: "Pts", alinhar: "centro", conteudo: (linha) => <span className="font-semibold text-slate-900">{linha.points}</span> },
  ];

  return (
    <>
      <CabecalhoDaPagina icone={ListOrdered} titulo="Classificação" descricao="Todos os clubes, com 3 pontos por vitória e 1 por empate.">
        <Link
          href="/partidas?nova=1"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50"
        >
          <Plus className="size-4" /> Nova partida
        </Link>
      </CabecalhoDaPagina>

      <div className="grid gap-4 xl:grid-cols-[1fr_19rem]">
        <section className="self-start overflow-hidden rounded-2xl border border-slate-200">
          <Tabela
            colunas={colunas}
            itens={classificacao.dados ?? []}
            carregando={classificacao.carregando}
            erro={classificacao.erro}
            tentarDeNovo={classificacao.tentarDeNovo}
            tituloDoErro="Não foi possível carregar a classificação"
            chaveDoItem={(linha) => linha.club_id}
            vazia={{ icone: ShieldHalf, titulo: "Nenhum clube cadastrado", texto: "A classificação mostra todos os clubes, mesmo os que ainda não jogaram." }}
          />
          {classificacao.dados?.length > 0 && (
            <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
              J: jogos · V: vitórias · E: empates · D: derrotas · GP: gols marcados · GC: gols sofridos · SG: saldo de gols · Pts: pontos
            </p>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <Cartao titulo="Últimas partidas" descricao="Da mais recente para a mais antiga.">
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm">
              {partidas.length === 0 && <p className="text-slate-600">Nenhuma partida jogada ainda.</p>}
              {partidas.slice(0, PARTIDAS_RECENTES).map((partida) => (
                <Link key={partida.id} href={`/partidas/${partida.id}`} className="block hover:text-primaria">
                  <span className="block text-xs text-slate-500">{formatarDataHora(partida.played_at)}</span>
                  <span className="flex items-center gap-2">
                    <span className={partida.result === "MANDANTE" ? "font-semibold" : ""}>{partida.home.club_name}</span>
                    <span className="rounded-md bg-slate-100 px-1.5 font-semibold">
                      {partida.home.goals} × {partida.away.goals}
                    </span>
                    <span className={partida.result === "VISITANTE" ? "font-semibold" : ""}>{partida.away.club_name}</span>
                  </span>
                </Link>
              ))}
              <Link href="/partidas" className="inline-flex items-center gap-1 text-primaria hover:underline">
                Ver todas as partidas <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Cartao>
          <Cartao titulo="Ordem da tabela" descricao="Critérios de classificação, nesta ordem.">
            <ol className="flex flex-col gap-2.5 border-t border-slate-200 px-5 py-4 text-sm text-slate-900">
              {CRITERIOS.map((criterio, indice) => (
                <li key={criterio} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-xs">{indice + 1}</span>
                  {criterio}
                </li>
              ))}
            </ol>
          </Cartao>
        </div>
      </div>
    </>
  );
}
