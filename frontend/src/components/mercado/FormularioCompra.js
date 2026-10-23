"use client";

import { Info, RefreshCw, ShieldHalf, ShoppingCart } from "lucide-react";

import { Alerta } from "@/components/ui/Alerta";
import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada, Selecao } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { ResumoDoJogador } from "@/components/ui/ResumoDoJogador";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { formatarMoeda, paraDataHoraDaApi } from "@/lib/formatacao";
import { obrigatorio } from "@/lib/validacao";
import { SEM_CONEXAO } from "@/services/api";
import { comprarJogador } from "@/services/mercado";

const REGRAS = {
  club_id: [obrigatorio("Escolha o clube comprador.")],
  data: [obrigatorio("Informe a data.")],
  hora: [obrigatorio("Informe a hora.")],
};

export function FormularioCompra({ jogador, clubes, clubeInicial, aoFechar, aoComprar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario({ club_id: clubeInicial ?? "", data: "", hora: "" }, REGRAS);
  const { executar, enviando, erro } = useAcao((dados) => comprarJogador(jogador.id, dados), aoComprar);
  const clubeEscolhido = clubes.find((clube) => String(clube.id) === String(valores.club_id));

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({ club_id: Number(valores.club_id), loyalty_until: paraDataHoraDaApi(valores.data, valores.hora) });
    }
  }

  return (
    <Modal
      titulo="Comprar jogador"
      descricao="Escolha o clube comprador e até quando vai a fidelidade do contrato."
      aoFechar={aoFechar}
      largura="max-w-xl"
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="submit" form="formulario-compra" carregando={enviando}>
            {!enviando && (erro?.status === SEM_CONEXAO ? <RefreshCw className="size-4" /> : <ShoppingCart className="size-4" />)}
            {enviando ? "Comprando..." : erro?.status === SEM_CONEXAO ? "Tentar de novo" : "Confirmar compra"}
          </Botao>
        </>
      }
    >
      <form id="formulario-compra" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <AlertaDeErro erro={erro} titulo="Compra recusada" />
        <ResumoDoJogador jogador={jogador}>
          <span className="text-right">
            <span className="block text-xs text-slate-600">Valor de mercado</span>
            <span className="block text-lg font-semibold text-slate-900">{formatarMoeda(jogador.market_value)}</span>
          </span>
        </ResumoDoJogador>
        <Campo
          id="compra-clube"
          rotulo="Clube comprador"
          erro={erros.club_id}
          dica={clubeEscolhido ? `Caixa atual: ${formatarMoeda(clubeEscolhido.cash)}. O custo total (valor + taxa) pode ir até 50% do caixa.` : undefined}
        >
          <Selecao
            id="compra-clube"
            icone={ShieldHalf}
            erro={erros.club_id}
            vazia="Selecione o clube"
            opcoes={clubes.map((clube) => ({ valor: clube.id, rotulo: `${clube.name} (${clube.acronym}) · caixa ${formatarMoeda(clube.cash)}` }))}
            value={valores.club_id}
            onChange={(evento) => alterar("club_id", evento.target.value)}
          />
        </Campo>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-900">Fim da fidelidade</legend>
          <div className="grid grid-cols-[1fr_9rem] gap-2">
            <Campo id="compra-data" erro={erros.data}>
              <Entrada id="compra-data" type="date" aria-label="Data do fim da fidelidade" erro={erros.data} value={valores.data} onChange={(evento) => alterar("data", evento.target.value)} />
            </Campo>
            <Campo id="compra-hora" erro={erros.hora}>
              <Entrada id="compra-hora" type="time" aria-label="Hora do fim da fidelidade" erro={erros.hora} value={valores.hora} onChange={(evento) => alterar("hora", evento.target.value)} />
            </Campo>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Depois do momento da compra e até 1.095 dias. Horário de Brasília; enviado com o fuso (-03:00).
          </p>
        </fieldset>
        <Alerta>A taxa é de 5% do valor de mercado, só quando ele passa de 30,00. Taxa, custo e novo caixa são calculados ao confirmar.</Alerta>
        {enviando && (
          <p className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
            <Info className="size-3.5" aria-hidden /> Enviando a compra. Os botões ficam desabilitados até a resposta.
          </p>
        )}
      </form>
    </Modal>
  );
}
