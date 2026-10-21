"use client";

import { useCallback, useRef, useState } from "react";

import { useAvisos } from "@/contexts/AvisosContext";

// Envia uma ação uma única vez por clique: enquanto o pedido está em andamento, novos cliques são ignorados.
export function useAcao(acao, { mensagemDeSucesso, aoConcluir } = {}) {
  const avisos = useAvisos();
  const emAndamento = useRef(false);
  const [enviando, setEnviando] = useState(false);

  const executar = useCallback(
    async (...argumentos) => {
      if (emAndamento.current) {
        return;
      }
      emAndamento.current = true;
      setEnviando(true);
      try {
        const resultado = await acao(...argumentos);
        if (mensagemDeSucesso) {
          avisos.sucesso(typeof mensagemDeSucesso === "function" ? mensagemDeSucesso(resultado) : mensagemDeSucesso);
        }
        aoConcluir?.(resultado);
      } catch (erro) {
        avisos.erro(erro.message);
      } finally {
        emAndamento.current = false;
        setEnviando(false);
      }
    },
    [acao, mensagemDeSucesso, aoConcluir, avisos],
  );

  return { executar, enviando };
}
