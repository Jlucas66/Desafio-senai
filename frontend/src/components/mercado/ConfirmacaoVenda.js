"use client";

import { HandCoins } from "lucide-react";

import { Alerta } from "@/components/ui/Alerta";
import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { ListaDeValores } from "@/components/ui/ListaDeValores";
import { Modal } from "@/components/ui/Modal";
import { ResumoDoJogador } from "@/components/ui/ResumoDoJogador";
import { Selo } from "@/components/ui/Selo";
import { useAcao } from "@/hooks/useAcao";
import { tomDoPercentualDeMulta } from "@/lib/cores";
import { formatarDataHora, formatarInteiro, formatarMoeda } from "@/lib/formatacao";
import { venderJogador } from "@/services/mercado";

export function ConfirmacaoVenda({ jogador, nomeDoClube, ehTitular, aoFechar, aoVender }) {
  const { executar, enviando, erro } = useAcao(() => venderJogador(jogador.id), aoVender);
  const { contract: contrato } = jogador;

  return (
    <Modal
      titulo={`Vender ${jogador.name}?`}
      descricao={`O jogador sai do elenco do ${nomeDoClube} e volta a ficar livre.`}
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao onClick={executar} carregando={enviando}>
            {!enviando && <HandCoins className="size-4" />}
            {enviando ? "Vendendo..." : "Confirmar venda"}
          </Botao>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <AlertaDeErro erro={erro} titulo="A venda foi recusada" />
        {ehTitular && (
          <Alerta tipo="aviso" titulo={`${jogador.name} é titular`}>
            Ao vender, ele sai da escalação, e o {nomeDoClube} só volta a jogar partidas depois de escalar de novo os 5 titulares.
          </Alerta>
        )}
        <ResumoDoJogador jogador={jogador}>
          <span className="text-right">
            <span className="block text-xs text-slate-600">Valor de mercado</span>
            <span className="block text-lg font-semibold text-slate-900">{formatarMoeda(jogador.market_value)}</span>
          </span>
        </ResumoDoJogador>
        <ListaDeValores
          itens={[
            { rotulo: "Valor de compra", valor: formatarMoeda(contrato.purchase_value) },
            { rotulo: "Fim da fidelidade", valor: formatarDataHora(contrato.loyalty_until) },
            { rotulo: "Dias restantes", valor: formatarInteiro(contrato.remaining_days) },
            {
              rotulo: "% de multa se vender agora",
              valor: <Selo tom={tomDoPercentualDeMulta(contrato.penalty_rate)}>{contrato.penalty_rate}%</Selo>,
            },
          ]}
        />
        <Alerta>A venda é pelo valor de mercado do momento. Multa (teto de 10,00), lucro, comissão e crédito são calculados ao confirmar.</Alerta>
      </div>
    </Modal>
  );
}
