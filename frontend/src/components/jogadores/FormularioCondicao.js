"use client";

import { AcoesDoFormulario } from "@/components/ui/AcoesDoFormulario";
import { Campo, Selecao } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { CONDICOES, rotuloDaCondicao } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";
import { obrigatorio } from "@/lib/validacao";
import { alterarCondicao } from "@/services/jogadores";

const REGRAS = { condition: [obrigatorio] };

export function FormularioCondicao({ jogador, aoFechar, aoAlterar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario({ condition: jogador.condition }, REGRAS);
  const { executar, enviando } = useAcao((condicao) => alterarCondicao(jogador.id, condicao), {
    mensagemDeSucesso: (atualizado) =>
      `${atualizado.name} está ${rotuloDaCondicao(atualizado.condition).toLowerCase()}; valor de mercado ${formatarMoeda(atualizado.market_value)}.`,
    aoConcluir: aoAlterar,
  });
  const estaDoente = jogador.condition === "DOENTE";
  // De DOENTE não se vai direto para APTO (409); a tela impede a escolha e mostra o motivo.
  const opcoes = CONDICOES.map((condicao) => ({ ...condicao, desabilitada: estaDoente && condicao.valor === "APTO" }));

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar(valores.condition);
    }
  }

  return (
    <Modal titulo={`Condição de ${jogador.name}`} aoFechar={aoFechar}>
      <form onSubmit={enviar} noValidate>
        <Campo
          id="condicao"
          rotulo="Condição física"
          erro={erros.condition}
          dica={estaDoente ? "De Doente, o jogador passa primeiro por Mal condicionado antes de voltar a Apto." : undefined}
        >
          <Selecao id="condicao" erro={erros.condition} opcoes={opcoes} value={valores.condition} onChange={(evento) => alterar("condition", evento.target.value)} />
        </Campo>
        <AcoesDoFormulario rotulo="Salvar" enviando={enviando} aoCancelar={aoFechar} />
      </form>
    </Modal>
  );
}
