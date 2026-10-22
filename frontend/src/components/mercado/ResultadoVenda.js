import { History } from "lucide-react";

import { Botao } from "@/components/ui/Botao";
import { IconeDeSucesso } from "@/components/ui/IconeDeSucesso";
import { ListaDeValores } from "@/components/ui/ListaDeValores";
import { Modal } from "@/components/ui/Modal";
import { Selo } from "@/components/ui/Selo";
import { formatarComSinal, formatarInteiro, formatarMoeda } from "@/lib/formatacao";

function corDoValor(valor) {
  if (valor > 0) {
    return "text-emerald-700";
  }
  return valor < 0 ? "text-red-600" : "text-slate-900";
}

export function ResultadoVenda({ venda, nomeDoClube, aoVerHistorico, aoFechar }) {
  const rescindido = venda.contract_status === "RESCINDIDO";
  return (
    <Modal
      titulo="Venda concluída"
      descricao={`${venda.player_name} voltou a ficar livre e saiu da escalação.`}
      icone={<IconeDeSucesso />}
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoVerHistorico}>
            <History className="size-4" /> Ver histórico
          </Botao>
          <Botao onClick={aoFechar}>Fechar</Botao>
        </>
      }
    >
      <ListaDeValores
        itens={[
          { rotulo: "Valor de compra", valor: formatarMoeda(venda.purchase_value) },
          { rotulo: "Valor de venda", detalhe: "Valor de mercado no momento da venda", valor: formatarMoeda(venda.value) },
          { rotulo: "Dias restantes", valor: formatarInteiro(venda.remaining_days) },
          { rotulo: "Multa", detalhe: `${venda.penalty_rate}% do valor de venda, com teto de 10,00`, valor: formatarMoeda(venda.penalty) },
          { rotulo: "Lucro", valor: <span className={corDoValor(venda.profit)}>{formatarComSinal(venda.profit)}</span> },
          { rotulo: "Comissão", detalhe: "10% do lucro até 10,00 + 20% do que passar", valor: formatarMoeda(venda.fee) },
          {
            rotulo: "Crédito no caixa",
            detalhe: "Valor de venda − multa − comissão",
            valor: <span className={corDoValor(venda.cash_change)}>{formatarComSinal(venda.cash_change)}</span>,
            destaque: true,
          },
          {
            rotulo: "Contrato",
            valor: (
              <Selo tom={rescindido ? "amarelo" : "verde"} ponto>
                {venda.contract_status}
              </Selo>
            ),
          },
          { rotulo: `Novo caixa do ${nomeDoClube}`, valor: formatarMoeda(venda.club_cash), destaque: true },
        ]}
      />
    </Modal>
  );
}
