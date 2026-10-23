"use client";

import { useCallback, useRef, useState } from "react";

import { useAtualizacao } from "@/contexts/AtualizacaoContext";

// Envia uma ação uma única vez por clique: enquanto o pedido está em andamento, novos cliques são ignorados.
// Depois do sucesso, as listas são atualizadas pela API (salvo nas ações que não mudam dados, como exportar);
// o erro fica guardado para a tela mostrar o message.
export function useAcao(acao, aoConcluir, { atualizarDados = true } = {}) {
  const { atualizar } = useAtualizacao();
  const emAndamento = useRef(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const executar = useCallback(
    async (...argumentos) => {
      if (emAndamento.current) {
        return;
      }
      emAndamento.current = true;
      setEnviando(true);
      setErro(null);
      try {
        const resultado = await acao(...argumentos);
        if (atualizarDados) {
          atualizar();
        }
        aoConcluir?.(resultado);
      } catch (erroDaApi) {
        setErro(erroDaApi);
      } finally {
        emAndamento.current = false;
        setEnviando(false);
      }
    },
    [acao, aoConcluir, atualizar, atualizarDados],
  );

  return { executar, enviando, erro };
}
