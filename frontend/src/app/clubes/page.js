"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { FormularioClube } from "@/components/clubes/FormularioClube";
import { TabelaClubes } from "@/components/clubes/TabelaClubes";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { Campo, Selecao } from "@/components/ui/Campo";
import { useCarregamento } from "@/hooks/useCarregamento";
import { ORDENACOES_DE_CLUBES } from "@/lib/dominio";
import { listarClubes } from "@/services/clubes";

export default function PaginaDeClubes() {
  const [ordenacao, setOrdenacao] = useState("name");
  const [criando, setCriando] = useState(false);

  const buscarClubes = useCallback(() => listarClubes(ordenacao), [ordenacao]);
  const clubes = useCarregamento(buscarClubes);

  function concluirCriacao() {
    setCriando(false);
    clubes.recarregar();
  }

  return (
    <>
      <CabecalhoDaPagina titulo="Clubes" descricao="Cada clube começa com 300,00 em caixa. A liga aceita até 20 clubes.">
        <Botao onClick={() => setCriando(true)}>
          <Plus className="size-4" /> Novo clube
        </Botao>
      </CabecalhoDaPagina>

      <div className="mb-3 flex justify-end">
        <div className="w-full sm:w-64">
          <Campo id="ordenacao-clubes" rotulo="Ordenar por">
            <Selecao id="ordenacao-clubes" opcoes={ORDENACOES_DE_CLUBES} value={ordenacao} onChange={(evento) => setOrdenacao(evento.target.value)} />
          </Campo>
        </div>
      </div>

      <TabelaClubes clubes={clubes.dados ?? []} carregando={clubes.carregando} erro={clubes.erro} />

      {criando && <FormularioClube aoFechar={() => setCriando(false)} aoCriar={concluirCriacao} />}
    </>
  );
}
