"use client";

import { Clock, Plus, ShieldHalf, Swords, Trophy, Users, ListOrdered } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";
import { plural } from "@/lib/formatacao";

function primeiraLetra(nome) {
  return nome.normalize("NFD")[0].toUpperCase();
}

function LinkDoMenu({ href, icone: Icone, rotulo, contador, ativo, aoNavegar }) {
  return (
    <Link
      href={href}
      onClick={aoNavegar}
      aria-current={ativo ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition ${
        ativo ? "border border-slate-200 bg-white font-medium text-slate-900 shadow-xs" : "text-slate-800 hover:bg-slate-200/60"
      }`}
    >
      {Icone && <Icone className={`size-4 ${ativo ? "text-primaria" : "text-slate-600"}`} aria-hidden />}
      <span className="flex-1">{rotulo}</span>
      {contador !== undefined && <span className="text-xs text-slate-500">{contador}</span>}
    </Link>
  );
}

function TituloDaSecao({ children, acao }) {
  return (
    <div className="mt-6 mb-1.5 flex items-center justify-between px-2.5 text-xs text-slate-500">
      {children}
      {acao}
    </div>
  );
}

export function BarraLateral({ aoNavegar }) {
  const caminho = usePathname();
  const { totalDeJogadores, clubes, partidas } = useResumoDaLiga();
  const ultimaPartida = partidas[0];

  return (
    <div className="flex h-full flex-col px-3 py-4">
      <Link href="/" onClick={aoNavegar} className="flex items-center gap-2.5 px-1.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primaria text-lg font-bold text-white">P</span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-slate-900">Passe</span>
          <span className="block text-xs text-slate-500">Gestão da liga</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        <TituloDaSecao>Mercado</TituloDaSecao>
        <div className="flex flex-col gap-0.5">
          <LinkDoMenu href="/jogadores" icone={Users} rotulo="Jogadores" contador={totalDeJogadores} ativo={caminho.startsWith("/jogadores")} aoNavegar={aoNavegar} />
          <LinkDoMenu href="/clubes" icone={ShieldHalf} rotulo="Clubes" contador={clubes.length} ativo={caminho === "/clubes"} aoNavegar={aoNavegar} />
        </div>
        <TituloDaSecao>Liga</TituloDaSecao>
        <div className="flex flex-col gap-0.5">
          <LinkDoMenu href="/partidas" icone={Swords} rotulo="Partidas" contador={partidas.length} ativo={caminho.startsWith("/partidas")} aoNavegar={aoNavegar} />
          <LinkDoMenu href="/classificacao" icone={ListOrdered} rotulo="Classificação" ativo={caminho.startsWith("/classificacao")} aoNavegar={aoNavegar} />
        </div>
        <TituloDaSecao
          acao={
            <Link href="/clubes?novo=1" onClick={aoNavegar} aria-label="Novo clube" className="text-slate-500 hover:text-slate-900">
              <Plus className="size-4" />
            </Link>
          }
        >
          Clubes
        </TituloDaSecao>
        <div className="flex flex-col gap-0.5">
          {clubes.length === 0 && <p className="px-2.5 text-xs text-slate-500">Nenhum clube ainda.</p>}
          {clubes.map((clube) => {
            const ativo = caminho === `/clubes/${clube.id}`;
            return (
              <Link
                key={clube.id}
                href={`/clubes/${clube.id}`}
                onClick={aoNavegar}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition ${
                  ativo ? "border border-slate-200 bg-white font-medium text-slate-900 shadow-xs" : "text-slate-800 hover:bg-slate-200/60"
                }`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded text-[11px] font-medium ${
                    ativo ? "bg-primaria text-white" : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {primeiraLetra(clube.name)}
                </span>
                {clube.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Trophy className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-slate-900">Liga Fictícia 2026</p>
            <p className="text-xs text-slate-500">
              {plural(clubes.length, "clube", "clubes")} · {plural(totalDeJogadores ?? 0, "jogador", "jogadores")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Swords className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-slate-900">Última partida</p>
            <p className="text-xs text-slate-500">
              {ultimaPartida
                ? `${ultimaPartida.home.club_name} ${ultimaPartida.home.goals} × ${ultimaPartida.away.goals} ${ultimaPartida.away.club_name}`
                : "nenhuma ainda"}
            </p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <Clock className="size-3.5" aria-hidden /> Horário de Brasília (UTC−3)
        </p>
      </div>
    </div>
  );
}
