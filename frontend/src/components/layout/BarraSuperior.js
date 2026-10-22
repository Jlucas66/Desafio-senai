"use client";

import { ChevronRight, PanelLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAtualizacao } from "@/contexts/AtualizacaoContext";
import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";

function migalhasDoCaminho(caminho, clubes, partidas) {
  const [, secao, id] = caminho.split("/");
  if (secao === "jogadores") {
    return [{ rotulo: "Mercado" }, { rotulo: "Jogadores" }];
  }
  if (secao === "clubes") {
    if (!id) {
      return [{ rotulo: "Mercado" }, { rotulo: "Clubes" }];
    }
    const clube = clubes.find((item) => String(item.id) === id);
    return [{ rotulo: "Mercado" }, { rotulo: "Clubes", href: "/clubes" }, { rotulo: clube?.name ?? `Clube ${id}` }];
  }
  if (secao === "partidas") {
    if (!id) {
      return [{ rotulo: "Liga" }, { rotulo: "Partidas" }];
    }
    const partida = partidas.find((item) => String(item.id) === id);
    const placar = partida
      ? `${partida.home.club_name} ${partida.home.goals} × ${partida.away.goals} ${partida.away.club_name}`
      : `Partida ${id}`;
    return [{ rotulo: "Liga" }, { rotulo: "Partidas", href: "/partidas" }, { rotulo: placar }];
  }
  if (secao === "classificacao") {
    return [{ rotulo: "Liga" }, { rotulo: "Classificação" }];
  }
  return [{ rotulo: "Início" }];
}

export function BarraSuperior({ aoAlternarMenu }) {
  const caminho = usePathname();
  const { atualizar } = useAtualizacao();
  const { clubes, partidas } = useResumoDaLiga();
  const migalhas = migalhasDoCaminho(caminho, clubes, partidas);

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
      <button type="button" onClick={aoAlternarMenu} aria-label="Mostrar ou esconder o menu" className="rounded-md p-1 text-slate-600 hover:bg-slate-100">
        <PanelLeft className="size-5" />
      </button>
      <span className="h-5 w-px bg-slate-200" aria-hidden />
      <nav aria-label="Você está em" className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        {migalhas.map((migalha, indice) => (
          <span key={migalha.rotulo} className="flex min-w-0 items-center gap-2">
            {indice > 0 && <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden />}
            {migalha.href ? (
              <Link href={migalha.href} className="text-slate-600 hover:text-slate-900">
                {migalha.rotulo}
              </Link>
            ) : (
              <span className={`truncate ${indice === migalhas.length - 1 ? "text-slate-900" : "text-slate-600"}`}>{migalha.rotulo}</span>
            )}
          </span>
        ))}
      </nav>
      <button type="button" onClick={atualizar} aria-label="Atualizar os dados" className="rounded-md p-1 text-slate-600 hover:bg-slate-100">
        <RefreshCw className="size-5" />
      </button>
    </header>
  );
}
