"use client";

import { ShieldHalf, Wallet } from "lucide-react";

import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { exatamenteLetras, obrigatorio, textoEntre } from "@/lib/validacao";
import { criarClube } from "@/services/clubes";

const REGRAS = {
  name: [obrigatorio("Informe o nome."), textoEntre(3, 60)],
  acronym: [obrigatorio("Informe a sigla."), exatamenteLetras(3)],
};

export function FormularioClube({ aoFechar, aoCriar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario({ name: "", acronym: "" }, REGRAS);
  const { executar, enviando, erro } = useAcao(criarClube, aoCriar);

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar(valores);
    }
  }

  return (
    <Modal
      titulo="Novo clube"
      descricao="Informe o nome e a sigla do clube."
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="submit" form="formulario-clube" carregando={enviando}>
            Criar clube
          </Botao>
        </>
      }
    >
      <form id="formulario-clube" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <AlertaDeErro erro={erro} titulo="Não foi possível criar o clube" />
        <Campo id="clube-nome" rotulo="Nome" erro={erros.name} dica="De 3 a 60 caracteres e de 2 a 5 palavras; só letras, espaços, hífen e ponto. Não pode repetir outro clube.">
          <Entrada id="clube-nome" icone={ShieldHalf} erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
        </Campo>
        <Campo id="clube-sigla" rotulo="Sigla" erro={erros.acronym} dica="3 letras de A a Z, maiúsculas, que aparecem no nome nessa ordem; a primeira é a primeira letra do nome.">
          <Entrada id="clube-sigla" maxLength={3} erro={erros.acronym} value={valores.acronym} onChange={(evento) => alterar("acronym", evento.target.value.toUpperCase())} />
        </Campo>
        <p className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Wallet className="size-4 shrink-0" aria-hidden /> O clube começa com 300,00 em caixa e sem jogadores.
        </p>
      </form>
    </Modal>
  );
}
