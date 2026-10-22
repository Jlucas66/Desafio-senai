import { Eye } from "lucide-react";

import { Botao } from "@/components/ui/Botao";
import { IconeDeSucesso } from "@/components/ui/IconeDeSucesso";
import { ListaDeValores } from "@/components/ui/ListaDeValores";
import { Modal } from "@/components/ui/Modal";
import { rotuloDaPosicao } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";

export function ResultadoCadastro({ jogador, aoFechar, aoVerDetalhes }) {
  return (
    <Modal
      titulo="Jogador cadastrado"
      descricao={`${jogador.name} entrou livre e Apto. Valores em moedas, calculados pela API ao salvar.`}
      icone={<IconeDeSucesso />}
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoVerDetalhes}>
            <Eye className="size-4" /> Ver detalhes
          </Botao>
          <Botao onClick={aoFechar}>Fechar</Botao>
        </>
      }
    >
      <ListaDeValores
        itens={[
          { rotulo: "Valor base", detalhe: "Calculado no cadastro; não muda depois", valor: formatarMoeda(jogador.base_value), destaque: true },
          { rotulo: "Valor de mercado", detalhe: "Com condição, agilidade e idade", valor: formatarMoeda(jogador.market_value) },
          { rotulo: "Overall", detalhe: `Pelos pesos da posição ${rotuloDaPosicao(jogador.position)}`, valor: jogador.overall },
        ]}
      />
    </Modal>
  );
}
