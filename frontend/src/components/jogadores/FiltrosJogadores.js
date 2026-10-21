"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada, Selecao } from "@/components/ui/Campo";
import { CONDICOES, POSICOES } from "@/lib/dominio";

const FILTROS_VAZIOS = {
  search: "",
  position: "",
  condition: "",
  free: "",
  club_id: "",
  min_age: "",
  max_age: "",
  min_value: "",
  max_value: "",
};

const SITUACOES = [
  { valor: "true", rotulo: "Só livres" },
  { valor: "false", rotulo: "Só com clube" },
];

export function FiltrosJogadores({ clubes, aoAplicar }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);

  function alterar(campo, valor) {
    setFiltros((atuais) => {
      const novos = { ...atuais, [campo]: valor };
      // "Só livres" não combina com o filtro por clube (a API recusa com 400), então a tela impede a combinação.
      return campo === "free" && valor === "true" ? { ...novos, club_id: "" } : novos;
    });
  }

  function aplicar(evento) {
    evento.preventDefault();
    aoAplicar({ ...filtros, search: filtros.search.trim() });
  }

  function limpar() {
    setFiltros(FILTROS_VAZIOS);
    aoAplicar(FILTROS_VAZIOS);
  }

  const opcoesDeClube = clubes.map((clube) => ({ valor: String(clube.id), rotulo: clube.name }));

  return (
    <form onSubmit={aplicar} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2">
        <Campo id="filtro-busca" rotulo="Buscar pelo nome">
          <Entrada
            id="filtro-busca"
            type="search"
            placeholder="Ex.: joao, lua"
            value={filtros.search}
            onChange={(evento) => alterar("search", evento.target.value)}
          />
        </Campo>
      </div>
      <Campo id="filtro-posicao" rotulo="Posição">
        <Selecao id="filtro-posicao" vazia="Todas" opcoes={POSICOES} value={filtros.position} onChange={(evento) => alterar("position", evento.target.value)} />
      </Campo>
      <Campo id="filtro-condicao" rotulo="Condição">
        <Selecao id="filtro-condicao" vazia="Todas" opcoes={CONDICOES} value={filtros.condition} onChange={(evento) => alterar("condition", evento.target.value)} />
      </Campo>
      <Campo id="filtro-situacao" rotulo="Situação">
        <Selecao id="filtro-situacao" vazia="Todos" opcoes={SITUACOES} value={filtros.free} onChange={(evento) => alterar("free", evento.target.value)} />
      </Campo>
      <Campo id="filtro-clube" rotulo="Clube" dica={filtros.free === "true" ? "Indisponível com “Só livres”." : undefined}>
        <Selecao
          id="filtro-clube"
          vazia="Todos"
          opcoes={opcoesDeClube}
          value={filtros.club_id}
          disabled={filtros.free === "true"}
          onChange={(evento) => alterar("club_id", evento.target.value)}
        />
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo id="filtro-idade-minima" rotulo="Idade mín.">
          <Entrada id="filtro-idade-minima" type="number" min={16} max={45} value={filtros.min_age} onChange={(evento) => alterar("min_age", evento.target.value)} />
        </Campo>
        <Campo id="filtro-idade-maxima" rotulo="Idade máx.">
          <Entrada id="filtro-idade-maxima" type="number" min={16} max={45} value={filtros.max_age} onChange={(evento) => alterar("max_age", evento.target.value)} />
        </Campo>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo id="filtro-valor-minimo" rotulo="Valor mín.">
          <Entrada id="filtro-valor-minimo" type="number" min={0} max={550} step="0.01" value={filtros.min_value} onChange={(evento) => alterar("min_value", evento.target.value)} />
        </Campo>
        <Campo id="filtro-valor-maximo" rotulo="Valor máx.">
          <Entrada id="filtro-valor-maximo" type="number" min={0} max={550} step="0.01" value={filtros.max_value} onChange={(evento) => alterar("max_value", evento.target.value)} />
        </Campo>
      </div>
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
        <Botao variante="secundario" onClick={limpar}>
          Limpar
        </Botao>
        <Botao type="submit">
          <Search className="size-4" /> Filtrar
        </Botao>
      </div>
    </form>
  );
}
