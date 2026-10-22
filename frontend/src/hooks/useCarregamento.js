"use client";

import { useEffect, useState } from "react";

import { useAtualizacao } from "@/contexts/AtualizacaoContext";

// Carrega dados da API e expõe os três estados das telas de lista: carregando, erro e dados.
// A função recebida deve vir de um useCallback: quando ela muda (outros filtros), os dados são buscados de novo,
// e também depois de cada ação, pela versão global de atualização.
export function useCarregamento(buscar) {
  const { versao, atualizar } = useAtualizacao();
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null });

  useEffect(() => {
    let ativo = true;
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }));
    buscar()
      .then((dados) => ativo && setEstado({ dados, carregando: false, erro: null }))
      .catch((erro) => ativo && setEstado({ dados: null, carregando: false, erro }));
    return () => {
      ativo = false;
    };
  }, [buscar, versao]);

  return { ...estado, tentarDeNovo: atualizar };
}
