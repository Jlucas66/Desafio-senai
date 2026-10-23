import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Botao } from "@/components/ui/Botao";
import { IconeDeSucesso } from "@/components/ui/IconeDeSucesso";
import { ListaDeValores } from "@/components/ui/ListaDeValores";
import { Modal } from "@/components/ui/Modal";
import { Selo } from "@/components/ui/Selo";
import { formatarDataHora, formatarMoeda } from "@/lib/formatacao";

export function ResultadoCompra({ compra, nomeDoClube, aoFechar }) {
  // O custo total é a única soma feita na tela (valor + taxa), como o enunciado permite.
  const custoTotal = compra.value + compra.fee;
  return (
    <Modal
      titulo="Compra concluída"
      descricao={`${compra.player_name} agora é do ${nomeDoClube}.`}
      icone={<IconeDeSucesso />}
      aoFechar={aoFechar}
      rodape={
        <>
          <Link
            href={`/clubes/${compra.club_id}`}
            onClick={aoFechar}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Ver clube <ArrowRight className="size-4" />
          </Link>
          <Botao onClick={aoFechar}>Fechar</Botao>
        </>
      }
    >
      <ListaDeValores
        itens={[
          { rotulo: "Valor", detalhe: "Valor de mercado no momento da compra", valor: formatarMoeda(compra.value) },
          {
            rotulo: "Taxa",
            detalhe: compra.fee > 0 ? "5% do valor, porque passa de 30,00" : "Sem taxa: o valor não passa de 30,00",
            valor: formatarMoeda(compra.fee),
          },
          { rotulo: "Custo total", detalhe: "Valor + taxa", valor: formatarMoeda(custoTotal), destaque: true },
          { rotulo: "Fim da fidelidade", valor: formatarDataHora(compra.contract.loyalty_until) },
          { rotulo: "Contrato", valor: <Selo tom="verde" ponto>{compra.contract.status}</Selo> },
          { rotulo: `Novo caixa do ${nomeDoClube}`, valor: formatarMoeda(compra.club_cash), destaque: true },
        ]}
      />
    </Modal>
  );
}
