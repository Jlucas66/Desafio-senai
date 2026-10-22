"use client";

import { createContext, useCallback, useContext } from "react";

import { useCarregamento } from "@/hooks/useCarregamento";
import { listarClubes } from "@/services/clubes";
import { listarJogadores } from "@/services/jogadores";
import { listarPartidas } from "@/services/liga";

const ResumoDaLigaContext = createContext(null);

// Dados da liga usados em várias telas (menu lateral, filtros por clube e escolha de clubes): uma busca só.
export function ResumoDaLigaProvider({ children }) {
  const buscar = useCallback(async () => {
    const [jogadores, clubes, partidas] = await Promise.all([
      listarJogadores({ limit: 1 }),
      listarClubes(),
      listarPartidas(),
    ]);
    return { totalDeJogadores: jogadores.meta.total_items, clubes, partidas };
  }, []);
  const resumo = useCarregamento(buscar);

  return <ResumoDaLigaContext.Provider value={resumo}>{children}</ResumoDaLigaContext.Provider>;
}

export function useResumoDaLiga() {
  const { dados, carregando, erro } = useContext(ResumoDaLigaContext);
  return {
    carregando,
    erro,
    totalDeJogadores: dados?.totalDeJogadores,
    clubes: dados?.clubes ?? [],
    partidas: dados?.partidas ?? [],
  };
}
