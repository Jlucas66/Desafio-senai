"use client";

import { AcoesDoFormulario } from "@/components/ui/AcoesDoFormulario";
import { Campo, Entrada, Selecao } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { INDICADORES, POSICOES } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";
import { inteiroEntre, obrigatorio, textoEntre } from "@/lib/validacao";
import { cadastrarJogador } from "@/services/jogadores";

const VALORES_INICIAIS = Object.fromEntries(
  ["name", "position", "agility", "age", ...INDICADORES.map((indicador) => indicador.campo)].map((campo) => [campo, ""]),
);

const REGRAS = {
  name: [obrigatorio, textoEntre(3, 100)],
  position: [obrigatorio],
  agility: [obrigatorio, inteiroEntre(1, 100)],
  age: [obrigatorio, inteiroEntre(16, 45)],
  ...Object.fromEntries(INDICADORES.map((indicador) => [indicador.campo, [obrigatorio, inteiroEntre(1, 99)]])),
};

const CAMPOS_NUMERICOS = ["agility", "age", ...INDICADORES.map((indicador) => indicador.campo)];

export function FormularioCadastro({ aoFechar, aoCadastrar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario(VALORES_INICIAIS, REGRAS);
  const { executar, enviando } = useAcao(cadastrarJogador, {
    mensagemDeSucesso: (jogador) =>
      `${jogador.name} cadastrado: overall ${jogador.overall} e valor base ${formatarMoeda(jogador.base_value)}.`,
    aoConcluir: aoCadastrar,
  });

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({
        ...valores,
        ...Object.fromEntries(CAMPOS_NUMERICOS.map((campo) => [campo, Number(valores[campo])])),
      });
    }
  }

  return (
    <Modal titulo="Novo jogador" aoFechar={aoFechar} largura="max-w-2xl">
      <form onSubmit={enviar} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="cadastro-nome" rotulo="Nome" erro={erros.name}>
              <Entrada id="cadastro-nome" erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
            </Campo>
          </div>
          <Campo id="cadastro-posicao" rotulo="Posição" erro={erros.position}>
            <Selecao
              id="cadastro-posicao"
              erro={erros.position}
              vazia="Selecione"
              opcoes={POSICOES}
              value={valores.position}
              onChange={(evento) => alterar("position", evento.target.value)}
            />
          </Campo>
          <div className="grid grid-cols-2 gap-4">
            <Campo id="cadastro-agilidade" rotulo="Agilidade" erro={erros.agility}>
              <Entrada id="cadastro-agilidade" type="number" erro={erros.agility} value={valores.agility} onChange={(evento) => alterar("agility", evento.target.value)} />
            </Campo>
            <Campo id="cadastro-idade" rotulo="Idade" erro={erros.age}>
              <Entrada id="cadastro-idade" type="number" erro={erros.age} value={valores.age} onChange={(evento) => alterar("age", evento.target.value)} />
            </Campo>
          </div>
        </div>
        <fieldset className="mt-5">
          <legend className="mb-3 text-sm font-semibold text-slate-900">Indicadores (1 a 99)</legend>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {INDICADORES.map((indicador) => (
              <Campo key={indicador.campo} id={`cadastro-${indicador.campo}`} rotulo={indicador.rotulo} erro={erros[indicador.campo]}>
                <Entrada
                  id={`cadastro-${indicador.campo}`}
                  type="number"
                  erro={erros[indicador.campo]}
                  value={valores[indicador.campo]}
                  onChange={(evento) => alterar(indicador.campo, evento.target.value)}
                />
              </Campo>
            ))}
          </div>
        </fieldset>
        <p className="mt-4 text-xs text-slate-500">O overall e o valor base são calculados pela API depois de salvar.</p>
        <AcoesDoFormulario rotulo="Cadastrar" enviando={enviando} aoCancelar={aoFechar} />
      </form>
    </Modal>
  );
}
