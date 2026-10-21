"use client";

import { AcoesDoFormulario } from "@/components/ui/AcoesDoFormulario";
import { Campo, Entrada, Selecao } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { POSICOES } from "@/lib/dominio";
import { inteiroEntre, obrigatorio, textoEntre } from "@/lib/validacao";
import { editarJogador } from "@/services/jogadores";

const REGRAS = {
  name: [obrigatorio, textoEntre(3, 100)],
  position: [obrigatorio],
  agility: [obrigatorio, inteiroEntre(1, 100)],
  age: [obrigatorio, inteiroEntre(16, 45)],
};

export function FormularioEdicao({ jogador, aoFechar, aoEditar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario(
    { name: jogador.name, position: jogador.position, agility: String(jogador.agility), age: String(jogador.age) },
    REGRAS,
  );
  const { executar, enviando } = useAcao((dados) => editarJogador(jogador.id, dados), {
    mensagemDeSucesso: (editado) => `${editado.name} atualizado.`,
    aoConcluir: aoEditar,
  });
  const temClube = jogador.club_id !== null;

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({ ...valores, agility: Number(valores.agility), age: Number(valores.age) });
    }
  }

  return (
    <Modal titulo={`Editar ${jogador.name}`} aoFechar={aoFechar}>
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Campo id="edicao-nome" rotulo="Nome" erro={erros.name}>
          <Entrada id="edicao-nome" erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
        </Campo>
        <Campo id="edicao-posicao" rotulo="Posição" erro={erros.position} dica={temClube ? "Jogador com clube não muda de posição." : undefined}>
          <Selecao
            id="edicao-posicao"
            erro={erros.position}
            opcoes={POSICOES}
            value={valores.position}
            disabled={temClube}
            onChange={(evento) => alterar("position", evento.target.value)}
          />
        </Campo>
        <div className="grid grid-cols-2 gap-4">
          <Campo id="edicao-agilidade" rotulo="Agilidade" erro={erros.agility}>
            <Entrada id="edicao-agilidade" type="number" erro={erros.agility} value={valores.agility} onChange={(evento) => alterar("agility", evento.target.value)} />
          </Campo>
          <Campo id="edicao-idade" rotulo="Idade" erro={erros.age}>
            <Entrada id="edicao-idade" type="number" erro={erros.age} value={valores.age} onChange={(evento) => alterar("age", evento.target.value)} />
          </Campo>
        </div>
        <p className="text-xs text-slate-500">Indicadores, potencial e valor base continuam os do cadastro.</p>
        <AcoesDoFormulario rotulo="Salvar" enviando={enviando} aoCancelar={aoFechar} />
      </form>
    </Modal>
  );
}
