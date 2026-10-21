"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";

import { TabelaElenco } from "@/components/clubes/TabelaElenco";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { Indicador } from "@/components/ui/Indicador";
import { useCarregamento } from "@/hooks/useCarregamento";
import { formatarMoeda } from "@/lib/formatacao";
import { buscarClube } from "@/services/clubes";

export default function PaginaDoClube() {
  const { id } = useParams();
  const buscar = useCallback(() => buscarClube(id), [id]);
  const clube = useCarregamento(buscar);

  return (
    <>
      <Link href="/clubes" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="size-4" /> Clubes
      </Link>

      <CabecalhoDaPagina
        titulo={clube.dados ? `${clube.dados.name} (${clube.dados.acronym})` : "Clube"}
        descricao="Caixa, elenco e contratos do clube."
      />

      {clube.dados && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Indicador rotulo="Caixa" valor={formatarMoeda(clube.dados.cash)} />
          <Indicador rotulo="Valor do elenco" valor={formatarMoeda(clube.dados.squad_value)} />
          <Indicador rotulo="Patrimônio" valor={formatarMoeda(clube.dados.net_worth)} destaque />
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Elenco</h2>
      <TabelaElenco jogadores={clube.dados?.players ?? []} carregando={clube.carregando} erro={clube.erro} />
    </>
  );
}
