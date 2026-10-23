"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AtualizacaoContext = createContext(null);

// Depois de cada ação (ou do botão de atualizar), todas as listas da tela buscam os dados de novo na API.
export function AtualizacaoProvider({ children }) {
  const [versao, setVersao] = useState(0);
  const atualizar = useCallback(() => setVersao((atual) => atual + 1), []);
  const valor = useMemo(() => ({ versao, atualizar }), [versao, atualizar]);

  return <AtualizacaoContext.Provider value={valor}>{children}</AtualizacaoContext.Provider>;
}

export function useAtualizacao() {
  return useContext(AtualizacaoContext);
}
