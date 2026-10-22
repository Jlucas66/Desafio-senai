"use client";

import { Trash2 } from "lucide-react";

import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Modal } from "@/components/ui/Modal";
import { ResumoDoJogador } from "@/components/ui/ResumoDoJogador";
import { Selo } from "@/components/ui/Selo";
import { useAcao } from "@/hooks/useAcao";
import { excluirJogador } from "@/services/jogadores";

export function ConfirmacaoExclusao({ jogador, aoFechar, aoExcluir }) {
  const { executar, enviando, erro } = useAcao(() => excluirJogador(jogador.id), aoExcluir);

  return (
    <Modal
      titulo={`Excluir ${jogador.name}?`}
      descricao="O jogador sai da lista e da busca, mas as transações e as partidas antigas dele continuam como foram gravadas."
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={executar} carregando={enviando}>
            {!enviando && <Trash2 className="size-4" />} Excluir jogador
          </Botao>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <AlertaDeErro erro={erro} titulo="Não foi possível excluir" />
        <ResumoDoJogador jogador={jogador}>
          <Selo>Livre</Selo>
        </ResumoDoJogador>
      </div>
    </Modal>
  );
}
