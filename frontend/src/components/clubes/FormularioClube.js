"use client";

import { AcoesDoFormulario } from "@/components/ui/AcoesDoFormulario";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { formatarMoeda } from "@/lib/formatacao";
import { exatamenteLetras, obrigatorio, textoEntre } from "@/lib/validacao";
import { criarClube } from "@/services/clubes";

const REGRAS = {
  name: [obrigatorio, textoEntre(3, 60)],
  acronym: [obrigatorio, exatamenteLetras(3)],
};

export function FormularioClube({ aoFechar, aoCriar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario({ name: "", acronym: "" }, REGRAS);
  const { executar, enviando } = useAcao(criarClube, {
    mensagemDeSucesso: (clube) => `${clube.name} criado com ${formatarMoeda(clube.cash)} em caixa.`,
    aoConcluir: aoCriar,
  });

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar(valores);
    }
  }

  return (
    <Modal titulo="Novo clube" aoFechar={aoFechar}>
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Campo id="clube-nome" rotulo="Nome" erro={erros.name} dica="De 2 a 5 palavras, só letras, espaços, hífen e ponto.">
          <Entrada id="clube-nome" erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
        </Campo>
        <Campo id="clube-sigla" rotulo="Sigla" erro={erros.acronym} dica="3 letras do nome, na ordem, começando pela primeira letra (ex.: Águias FC → AGU).">
          <Entrada
            id="clube-sigla"
            erro={erros.acronym}
            maxLength={3}
            value={valores.acronym}
            onChange={(evento) => alterar("acronym", evento.target.value.toUpperCase())}
          />
        </Campo>
        <AcoesDoFormulario rotulo="Criar clube" enviando={enviando} aoCancelar={aoFechar} />
      </form>
    </Modal>
  );
}
