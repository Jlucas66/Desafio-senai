"use client";

import { Lock, User } from "lucide-react";

import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { formatarMoeda } from "@/lib/formatacao";
import { inteiroEntre, obrigatorio, textoEntre } from "@/lib/validacao";
import { editarJogador } from "@/services/jogadores";

import { SeletorDePosicao } from "./SeletorDePosicao";

const REGRAS = {
  name: [obrigatorio("Informe o nome."), textoEntre(3, 100)],
  position: [obrigatorio("Escolha a posição.")],
  age: [obrigatorio("Informe a idade."), inteiroEntre(16, 45, "Use uma idade de 16 a 45 anos.")],
  agility: [obrigatorio("Informe a agilidade."), inteiroEntre(1, 100)],
};

export function FormularioEdicao({ jogador, aoFechar, aoEditar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario(
    { name: jogador.name, position: jogador.position, age: String(jogador.age), agility: String(jogador.agility) },
    REGRAS,
  );
  const { executar, enviando, erro } = useAcao((dados) => editarJogador(jogador.id, dados), aoEditar);
  const temClube = jogador.club_id !== null;

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({ ...valores, age: Number(valores.age), agility: Number(valores.agility) });
    }
  }

  return (
    <Modal
      titulo="Editar jogador"
      descricao="Edite nome, posição, idade e agilidade. Os demais dados não mudam."
      aoFechar={aoFechar}
      largura="max-w-xl"
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="submit" form="formulario-edicao" carregando={enviando}>
            Salvar alterações
          </Botao>
        </>
      }
    >
      <form id="formulario-edicao" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <AlertaDeErro erro={erro} titulo="Não foi possível salvar" />
        <Campo id="edicao-name" rotulo="Nome" erro={erros.name} dica="De 3 a 100 caracteres, com pelo menos duas palavras e sem números.">
          <Entrada id="edicao-name" icone={User} erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
        </Campo>
        <Campo
          id="edicao-posicao"
          rotulo="Posição"
          erro={erros.position}
          dica={temClube ? "Jogador com clube não muda de posição: as outras posições ficam desabilitadas." : undefined}
        >
          <SeletorDePosicao valor={valores.position} bloqueado={temClube} aoMudar={(posicao) => alterar("position", posicao)} />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="edicao-age" rotulo="Idade" erro={erros.age} dica={`De 16 a 45, sem diminuir (atual: ${jogador.age}).`}>
            <Entrada id="edicao-age" type="number" erro={erros.age} value={valores.age} onChange={(evento) => alterar("age", evento.target.value)} />
          </Campo>
          <Campo id="edicao-agility" rotulo="Agilidade" erro={erros.agility} dica="De 1 a 100 (até 85 com 35 anos ou mais).">
            <Entrada id="edicao-agility" type="number" erro={erros.agility} value={valores.agility} onChange={(evento) => alterar("agility", evento.target.value)} />
          </Campo>
        </div>
        <p className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-600">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          Não mudam depois do cadastro: valor base ({formatarMoeda(jogador.base_value)}), indicadores e potencial.
        </p>
      </form>
    </Modal>
  );
}
