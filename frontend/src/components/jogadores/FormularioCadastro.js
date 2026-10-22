"use client";

import { ChartNoAxesColumn, Info, Lock, User } from "lucide-react";

import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { ATRIBUTOS } from "@/lib/dominio";
import { inteiroEntre, obrigatorio, textoEntre, validar } from "@/lib/validacao";
import { cadastrarJogador } from "@/services/jogadores";

import { BarrasDeAtributos } from "./BarrasDeAtributos";
import { SeletorDePosicao } from "./SeletorDePosicao";

const INDICADORES = [...ATRIBUTOS, { campo: "potential", rotulo: "Potencial" }];

const REGRA_DO_INDICADOR = inteiroEntre(1, 99);

const REGRAS = {
  name: [obrigatorio("Informe o nome."), textoEntre(3, 100)],
  position: [obrigatorio("Escolha a posição.")],
  age: [obrigatorio("Informe a idade."), inteiroEntre(16, 45, "Use uma idade de 16 a 45 anos.")],
  agility: [obrigatorio("Informe a agilidade."), inteiroEntre(1, 100)],
  ...Object.fromEntries(
    INDICADORES.map((indicador) => [indicador.campo, [obrigatorio(`Informe ${indicador.campo === "potential" ? "o potencial" : "o valor"}.`), REGRA_DO_INDICADOR]]),
  ),
};

const VALORES_INICIAIS = Object.fromEntries(Object.keys(REGRAS).map((campo) => [campo, ""]));
const CAMPOS_NUMERICOS = ["age", "agility", ...INDICADORES.map((indicador) => indicador.campo)];

function CampoBloqueado({ id, rotulo, dica }) {
  return (
    <Campo id={id} rotulo={<span className="text-slate-500">{rotulo}</span>} dica={dica}>
      <Entrada id={id} icone={Lock} disabled placeholder="Após salvar" />
    </Campo>
  );
}

export function FormularioCadastro({ aoFechar, aoCadastrar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario(VALORES_INICIAIS, REGRAS);
  const { executar, enviando, erro } = useAcao(cadastrarJogador, aoCadastrar);
  const temErros = Object.values(erros).some(Boolean);
  const indicadoresValidos = Object.keys(validar(valores, Object.fromEntries(INDICADORES.map((i) => [i.campo, REGRAS[i.campo]])))).length === 0;

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({ ...valores, ...Object.fromEntries(CAMPOS_NUMERICOS.map((campo) => [campo, Number(valores[campo])])) });
    }
  }

  function campoNumerico(campo, rotulo, dica) {
    return (
      <Campo id={`cadastro-${campo}`} rotulo={rotulo} erro={erros[campo]} dica={dica}>
        <Entrada id={`cadastro-${campo}`} type="number" erro={erros[campo]} value={valores[campo]} onChange={(evento) => alterar(campo, evento.target.value)} />
      </Campo>
    );
  }

  return (
    <Modal
      titulo="Novo jogador"
      descricao={temErros ? "Corrija os campos destacados para salvar." : "Preencha os dados e os indicadores técnicos. O valor base, o overall e o valor de mercado são calculados ao salvar."}
      aoFechar={aoFechar}
      largura="max-w-3xl"
      rodape={
        <>
          <p className="mr-auto flex items-center gap-1.5 text-xs text-slate-600">
            <Info className="size-3.5" aria-hidden /> O jogador começa livre e Apto.
          </p>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="submit" form="formulario-cadastro" carregando={enviando}>
            Salvar jogador
          </Botao>
        </>
      }
    >
      <form id="formulario-cadastro" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <AlertaDeErro erro={erro} titulo="Não foi possível cadastrar o jogador" />
        <Campo id="cadastro-name" rotulo="Nome" erro={erros.name} dica="De 3 a 100 caracteres, com pelo menos duas palavras e sem números.">
          <Entrada id="cadastro-name" icone={User} erro={erros.name} value={valores.name} onChange={(evento) => alterar("name", evento.target.value)} />
        </Campo>
        <Campo id="cadastro-posicao" rotulo="Posição" erro={erros.position}>
          <SeletorDePosicao valor={valores.position} erro={erros.position} aoMudar={(posicao) => alterar("position", posicao)} />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-3">
          {campoNumerico("age", "Idade", "De 16 a 45 anos.")}
          {campoNumerico("agility", "Agilidade", "De 1 a 100 (até 85 com 35 anos ou mais).")}
          <CampoBloqueado id="cadastro-valor-base" rotulo="Valor base (moedas)" dica="Calculado no cadastro." />
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h3 className="font-semibold text-slate-900">Indicadores técnicos</h3>
          <p className="mt-1 text-sm text-slate-600">
            Seis atributos e o potencial, de 1 a 99. Não mudam depois do cadastro; a soma dos seis atributos não pode passar de 480.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_15rem]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDICADORES.map((indicador) =>
              campoNumerico(indicador.campo, indicador.rotulo, indicador.campo === "potential" ? "≥ maior atributo; igual a ele com 33+ anos" : undefined),
            )}
            <CampoBloqueado id="cadastro-overall" rotulo="Overall" dica="Calculado automaticamente" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <ChartNoAxesColumn className="size-3.5" aria-hidden /> Prévia dos atributos
            </p>
            {indicadoresValidos ? (
              <>
                <BarrasDeAtributos atributos={valores} potencial={valores.potential} compacto />
                <p className="mt-3 text-xs text-slate-500">
                  Faixa clara: até o potencial ({valores.potential}). A prévia só desenha os valores digitados; não calcula overall nem valor base.
                </p>
              </>
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">Preencha os indicadores, de 1 a 99, para ver a prévia.</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
