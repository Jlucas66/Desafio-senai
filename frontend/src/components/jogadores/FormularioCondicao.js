"use client";

import { Lock } from "lucide-react";
import { useCallback, useState } from "react";

import { Alerta } from "@/components/ui/Alerta";
import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Modal } from "@/components/ui/Modal";
import { ResumoDoJogador } from "@/components/ui/ResumoDoJogador";
import { useAcao } from "@/hooks/useAcao";
import { useCarregamento } from "@/hooks/useCarregamento";
import { CONDICOES } from "@/lib/dominio";
import { buscarEscalacao } from "@/services/clubes";
import { alterarCondicao } from "@/services/jogadores";

import { SeloDeCondicao } from "./SeloDeCondicao";

export function FormularioCondicao({ jogador, nomeDoClube, aoFechar, aoAlterar }) {
  const [condicao, setCondicao] = useState(jogador.condition);
  const { executar, enviando, erro } = useAcao((nova) => alterarCondicao(jogador.id, nova), aoAlterar);
  const buscarTitulares = useCallback(
    () => (jogador.club_id === null ? Promise.resolve(null) : buscarEscalacao(jogador.club_id)),
    [jogador.club_id],
  );
  const escalacao = useCarregamento(buscarTitulares);
  const ehTitular = Boolean(escalacao.dados?.players.some((titular) => titular.id === jogador.id));

  return (
    <Modal
      titulo="Alterar condição física"
      descricao="A condição muda o desconto do valor de mercado, recalculado ao salvar."
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao onClick={() => executar(condicao)} carregando={enviando}>
            Salvar condição
          </Botao>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <AlertaDeErro erro={erro} titulo="Não foi possível alterar a condição" />
        <ResumoDoJogador jogador={jogador}>
          <SeloDeCondicao condicao={jogador.condition} />
        </ResumoDoJogador>
        <div role="radiogroup" aria-label="Condição física" className="flex flex-col gap-2">
          {CONDICOES.map((opcao) => {
            // De DOENTE não se vai direto para APTO (409): a tela impede a escolha e mostra o motivo.
            const bloqueada = jogador.condition === "DOENTE" && opcao.valor === "APTO";
            const selecionada = condicao === opcao.valor;
            return (
              <label
                key={opcao.valor}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                  selecionada ? "border-primaria bg-blue-50/60" : "border-slate-200 hover:bg-slate-50"
                } ${bloqueada ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="condicao"
                  value={opcao.valor}
                  checked={selecionada}
                  disabled={bloqueada}
                  onChange={() => setCondicao(opcao.valor)}
                  className="mt-1 accent-primaria"
                />
                <span className="text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    {opcao.rotulo}
                    {jogador.condition === opcao.valor && <span className="rounded bg-slate-100 px-1.5 text-xs font-normal text-slate-600">Atual</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">{opcao.descricao}</span>
                  {bloqueada && (
                    <span className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                      <Lock className="size-3" aria-hidden /> De Doente não passa direto para Apto.
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
        {ehTitular && condicao === "DOENTE" && jogador.condition !== "DOENTE" && (
          <Alerta tipo="aviso" titulo={`${jogador.name} é titular`}>
            Ao passar a Doente, ele sai da escalação, e o {nomeDoClube} só volta a jogar partidas depois de escalar de novo os 5 titulares.
          </Alerta>
        )}
      </div>
    </Modal>
  );
}
