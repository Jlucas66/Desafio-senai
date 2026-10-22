"use client";

import { CircleDollarSign, HeartPulse, Search, Shirt, ShieldHalf, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada } from "@/components/ui/Campo";
import { ItemDoMenu, Menu, TituloDoMenu } from "@/components/ui/Menu";
import { CONDICOES, POSICOES, rotuloDaCondicao } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";

const TEMPO_DA_BUSCA_EM_MS = 400;
const TAMANHO_MINIMO_DA_BUSCA = 2;

export const FILTROS_VAZIOS = {
  search: "",
  position: "",
  condition: "",
  club_id: "",
  min_age: "",
  max_age: "",
  min_value: "",
  max_value: "",
};

function textoDaFaixa(minimo, maximo, formatar = (valor) => valor) {
  if (minimo && maximo) {
    return `${formatar(minimo)} a ${formatar(maximo)}`;
  }
  return minimo ? `a partir de ${formatar(minimo)}` : `até ${formatar(maximo)}`;
}

function FiltroDeFaixa({ icone, rotulo, campoMinimo, campoMaximo, filtros, aoMudar, formatar, passo, minimo, maximo }) {
  const [faixa, setFaixa] = useState({ minimo: filtros[campoMinimo], maximo: filtros[campoMaximo] });
  const ativo = Boolean(filtros[campoMinimo] || filtros[campoMaximo]);

  useEffect(() => {
    setFaixa({ minimo: filtros[campoMinimo], maximo: filtros[campoMaximo] });
  }, [filtros, campoMinimo, campoMaximo]);

  return (
    <Menu icone={icone} ativo={ativo} rotulo={ativo ? `${rotulo}: ${textoDaFaixa(filtros[campoMinimo], filtros[campoMaximo], formatar)}` : rotulo} largura="w-64">
      <TituloDoMenu>{rotulo}</TituloDoMenu>
      <div className="grid grid-cols-2 gap-2 px-2.5 pb-2">
        <Campo id={`${campoMinimo}-filtro`} rotulo="Mínimo">
          <Entrada id={`${campoMinimo}-filtro`} type="number" min={minimo} max={maximo} step={passo} value={faixa.minimo} onChange={(evento) => setFaixa({ ...faixa, minimo: evento.target.value })} />
        </Campo>
        <Campo id={`${campoMaximo}-filtro`} rotulo="Máximo">
          <Entrada id={`${campoMaximo}-filtro`} type="number" min={minimo} max={maximo} step={passo} value={faixa.maximo} onChange={(evento) => setFaixa({ ...faixa, maximo: evento.target.value })} />
        </Campo>
      </div>
      <div className="flex justify-end gap-2 px-2.5 pb-1">
        <Botao variante="discreto" data-fecha-menu onClick={() => aoMudar({ ...filtros, [campoMinimo]: "", [campoMaximo]: "" })}>
          Limpar
        </Botao>
        <Botao data-fecha-menu onClick={() => aoMudar({ ...filtros, [campoMinimo]: faixa.minimo, [campoMaximo]: faixa.maximo })}>
          Aplicar
        </Botao>
      </div>
    </Menu>
  );
}

function FiltroDeLista({ icone, rotulo, campo, opcoes, filtros, aoMudar, rotuloDoValor, desabilitado, dica }) {
  const valor = filtros[campo];
  return (
    <div title={desabilitado ? dica : undefined}>
      <Menu icone={icone} ativo={Boolean(valor)} desabilitado={desabilitado} rotulo={valor ? `${rotulo}: ${rotuloDoValor(valor)}` : rotulo}>
        <TituloDoMenu>{rotulo}</TituloDoMenu>
        <ItemDoMenu selecionado={!valor} onClick={() => aoMudar({ ...filtros, [campo]: "" })}>
          Todos
        </ItemDoMenu>
        {opcoes.map((opcao) => (
          <ItemDoMenu key={opcao.valor} selecionado={String(valor) === String(opcao.valor)} onClick={() => aoMudar({ ...filtros, [campo]: String(opcao.valor) })}>
            {opcao.rotulo}
          </ItemDoMenu>
        ))}
      </Menu>
    </div>
  );
}

export function FiltrosJogadores({ filtros, aoMudar, clubes, clubeIndisponivel }) {
  const [busca, setBusca] = useState(filtros.search);

  useEffect(() => {
    setBusca(filtros.search);
  }, [filtros.search]);

  useEffect(() => {
    const texto = busca.trim();
    // A API aceita busca de 2 a 100 caracteres: com 1 caractere, a tela espera o próximo.
    if (texto === filtros.search || (texto.length > 0 && texto.length < TAMANHO_MINIMO_DA_BUSCA)) {
      return undefined;
    }
    const temporizador = setTimeout(() => aoMudar({ ...filtros, search: texto }), TEMPO_DA_BUSCA_EM_MS);
    return () => clearTimeout(temporizador);
  }, [busca, filtros, aoMudar]);

  const opcoesDeClube = clubes.map((clube) => ({ valor: clube.id, rotulo: clube.name }));
  const nomeDoClube = (id) => clubes.find((clube) => String(clube.id) === String(id))?.name ?? `Clube ${id}`;

  return (
    <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 p-2">
      <div className="min-w-56 flex-1">
        <Entrada id="busca" type="search" icone={Search} placeholder="Buscar por nome" aria-label="Buscar por nome" value={busca} onChange={(evento) => setBusca(evento.target.value)} />
      </div>
      <FiltroDeLista icone={Shirt} rotulo="Posição" campo="position" opcoes={POSICOES.map((posicao) => ({ valor: posicao.valor, rotulo: `${posicao.valor} · ${posicao.rotulo}` }))} filtros={filtros} aoMudar={aoMudar} rotuloDoValor={(valor) => valor} />
      <FiltroDeLista icone={HeartPulse} rotulo="Condição" campo="condition" opcoes={CONDICOES} filtros={filtros} aoMudar={aoMudar} rotuloDoValor={rotuloDaCondicao} />
      <FiltroDeLista
        icone={ShieldHalf}
        rotulo="Clube"
        campo="club_id"
        opcoes={opcoesDeClube}
        filtros={filtros}
        aoMudar={aoMudar}
        rotuloDoValor={nomeDoClube}
        desabilitado={clubeIndisponivel}
        dica="“Livres” não combina com o filtro por clube."
      />
      <FiltroDeFaixa icone={User} rotulo="Idade" campoMinimo="min_age" campoMaximo="max_age" filtros={filtros} aoMudar={aoMudar} passo={1} minimo={16} maximo={45} />
      <FiltroDeFaixa icone={CircleDollarSign} rotulo="Valor de mercado" campoMinimo="min_value" campoMaximo="max_value" filtros={filtros} aoMudar={aoMudar} formatar={formatarMoeda} passo="0.01" minimo={0} maximo={550} />
    </div>
  );
}

export function FiltrosAtivos({ filtros, aoMudar, clubes }) {
  const nomeDoClube = clubes.find((clube) => String(clube.id) === String(filtros.club_id))?.name;
  const ativos = [
    filtros.search && { campos: ["search"], rotulo: `Busca: ${filtros.search}` },
    filtros.position && { campos: ["position"], rotulo: `Posição: ${filtros.position}` },
    filtros.condition && { campos: ["condition"], rotulo: `Condição: ${rotuloDaCondicao(filtros.condition)}` },
    filtros.club_id && { campos: ["club_id"], rotulo: `Clube: ${nomeDoClube ?? filtros.club_id}` },
    (filtros.min_age || filtros.max_age) && { campos: ["min_age", "max_age"], rotulo: `Idade: ${textoDaFaixa(filtros.min_age, filtros.max_age)}` },
    (filtros.min_value || filtros.max_value) && {
      campos: ["min_value", "max_value"],
      rotulo: `Valor de mercado: ${textoDaFaixa(filtros.min_value, filtros.max_value, formatarMoeda)}`,
    },
  ].filter(Boolean);

  if (ativos.length === 0) {
    return null;
  }
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-600">Filtros ativos:</span>
      {ativos.map((ativo) => (
        <span key={ativo.rotulo} className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-900">
          {ativo.rotulo}
          <button
            type="button"
            aria-label={`Remover filtro ${ativo.rotulo}`}
            onClick={() => aoMudar({ ...filtros, ...Object.fromEntries(ativo.campos.map((campo) => [campo, ""])) })}
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <Botao variante="link" onClick={() => aoMudar(FILTROS_VAZIOS)}>
        Limpar filtros
      </Botao>
    </div>
  );
}
