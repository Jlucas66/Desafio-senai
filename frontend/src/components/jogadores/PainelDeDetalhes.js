"use client";

import { ChartNoAxesColumn, CircleDollarSign, HeartPulse, Pencil, ShoppingCart, Tag, TrendingUp, X } from "lucide-react";
import { useEffect } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Botao } from "@/components/ui/Botao";
import { Selo } from "@/components/ui/Selo";
import { formatarMoeda } from "@/lib/formatacao";

import { BarrasDeAtributos } from "./BarrasDeAtributos";
import { SeloDeCondicao } from "./SeloDeCondicao";

function Destaque({ rotulo, valor, legenda, icone: Icone }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="flex items-center justify-between text-xs text-slate-600">
        {rotulo}
        <Icone className="size-4" aria-hidden />
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-500">{legenda}</p>
    </div>
  );
}

export function PainelDeDetalhes({ jogador, nomeDoClube, aoFechar, acoes }) {
  useEffect(() => {
    function fecharComEsc(evento) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [aoFechar]);

  const livre = jogador.club_id === null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={aoFechar}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${jogador.name}`}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Avatar nome={jogador.name} tamanho="grande" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{jogador.name}</h2>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Selo tom="contorno">{jogador.position}</Selo>
              <SeloDeCondicao condicao={jogador.condition} />
              <Selo>{livre ? "Livre" : nomeDoClube}</Selo>
            </div>
          </div>
          <button type="button" onClick={aoFechar} aria-label="Fechar painel" className="text-slate-500 hover:text-slate-900">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Destaque rotulo="Valor de mercado" valor={formatarMoeda(jogador.market_value)} legenda="Calculado automaticamente" icone={CircleDollarSign} />
          <Destaque rotulo="Valor base" valor={formatarMoeda(jogador.base_value)} legenda="Calculado no cadastro" icone={Tag} />
          <Destaque rotulo="Overall" valor={jogador.overall} legenda="Calculado pela posição" icone={ChartNoAxesColumn} />
          <Destaque rotulo="Potencial" valor={jogador.potential} legenda="Informado no cadastro" icone={TrendingUp} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Indicadores técnicos</h3>
          <span className="text-xs text-slate-500">Escala de 1 a 99</span>
        </div>
        <div className="mt-3">
          <BarrasDeAtributos atributos={jogador} potencial={jogador.potential} />
        </div>
        <p className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-primaria" /> Valor do atributo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-blue-200" /> Até o potencial ({jogador.potential}), que nenhum atributo passa
          </span>
        </p>
        <dl className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 text-sm">
          {[
            ["Idade", `${jogador.age} anos`],
            ["Agilidade", jogador.agility],
            ["Clube", livre ? "Livre" : nomeDoClube],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="flex justify-between px-4 py-3">
              <dt className="text-slate-600">{rotulo}</dt>
              <dd className="font-medium text-slate-900">{valor}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          <Botao variante="secundario" onClick={() => acoes.editar(jogador)}>
            <Pencil className="size-4" /> Editar
          </Botao>
          <Botao variante="secundario" onClick={() => acoes.alterarCondicao(jogador)}>
            <HeartPulse className="size-4" /> Alterar condição
          </Botao>
          {livre && (
            <Botao className="ml-auto" onClick={() => acoes.comprar(jogador)}>
              <ShoppingCart className="size-4" /> Comprar
            </Botao>
          )}
        </div>
      </aside>
    </div>
  );
}
