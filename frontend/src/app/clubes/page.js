"use client";

import { ArrowUpDown, Plus, ShieldHalf } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

import { FormularioClube } from "@/components/clubes/FormularioClube";
import { TabelaClubes } from "@/components/clubes/TabelaClubes";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { ItemDoMenu, Menu, TituloDoMenu } from "@/components/ui/Menu";
import { useAvisos } from "@/contexts/AvisosContext";
import { useCarregamento } from "@/hooks/useCarregamento";
import { MAXIMO_DE_CLUBES, ORDENACOES_DE_CLUBES } from "@/lib/dominio";
import { formatarMoeda, plural } from "@/lib/formatacao";
import { listarClubes } from "@/services/clubes";

function PaginaDeClubes() {
  const parametrosDaUrl = useSearchParams();
  const roteador = useRouter();
  const avisos = useAvisos();
  const [ordenacao, setOrdenacao] = useState("name");
  const [criando, setCriando] = useState(parametrosDaUrl.get("novo") === "1");

  const buscarClubes = useCallback(() => listarClubes(ordenacao), [ordenacao]);
  const clubes = useCarregamento(buscarClubes);
  const quantidade = clubes.dados?.length ?? 0;
  const ordenacaoAtual = ORDENACOES_DE_CLUBES.find((item) => item.valor === ordenacao);

  function concluirCriacao(clube) {
    setCriando(false);
    avisos.sucesso("Clube criado", `${clube.name} (${clube.acronym}) começa com ${formatarMoeda(clube.cash)} em caixa.`);
    roteador.push(`/clubes/${clube.id}`);
  }

  return (
    <>
      <CabecalhoDaPagina icone={ShieldHalf} titulo="Clubes" descricao="Cada clube começa com 300,00 em caixa e sem jogadores. A liga aceita no máximo 20 clubes.">
        <Botao onClick={() => setCriando(true)}>
          <Plus className="size-4" /> Novo clube
        </Botao>
      </CabecalhoDaPagina>

      <section className="rounded-2xl border border-slate-200">
        {(clubes.carregando || quantidade > 0) && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="flex items-center gap-2 font-medium text-slate-900">
              {plural(quantidade, "clube", "clubes")}
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-normal text-slate-700">
                {quantidade} de {MAXIMO_DE_CLUBES}
              </span>
            </p>
            <Menu icone={ArrowUpDown} rotulo={`Ordenar: ${ordenacaoAtual.curto}`} alinhamento="direita" largura="w-72">
              <TituloDoMenu>Ordenar por</TituloDoMenu>
              {ORDENACOES_DE_CLUBES.map((opcao) => (
                <ItemDoMenu key={opcao.valor} selecionado={opcao.valor === ordenacao} onClick={() => setOrdenacao(opcao.valor)}>
                  {opcao.rotulo}
                </ItemDoMenu>
              ))}
            </Menu>
          </div>
        )}
        <TabelaClubes clubes={clubes.dados ?? []} carregando={clubes.carregando} erro={clubes.erro} tentarDeNovo={clubes.tentarDeNovo} aoNovo={() => setCriando(true)} />
      </section>

      {criando && <FormularioClube aoFechar={() => setCriando(false)} aoCriar={concluirCriacao} />}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <PaginaDeClubes />
    </Suspense>
  );
}
