"use client";

import { useCallback, useEffect, useState } from "react";

// Carrega dados da API e expõe os três estados das telas de lista: carregando, erro e dados.
// A função recebida deve vir de um useCallback: quando ela muda (outros filtros), os dados são buscados de novo.
export function useCarregamento(buscar) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null });
  const [versao, setVersao] = useState(0);

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

  const recarregar = useCallback(() => setVersao((atual) => atual + 1), []);

  return { ...estado, recarregar };
}
