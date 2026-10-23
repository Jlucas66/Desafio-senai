"use client";

import { Check, CircleCheck, Lock, Swords, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SeloDeCondicao } from "@/components/jogadores/SeloDeCondicao";
import { Alerta } from "@/components/ui/Alerta";
import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Avatar } from "@/components/ui/Avatar";
import { Botao } from "@/components/ui/Botao";
import { Cartao } from "@/components/ui/Cartao";
import { Selecao } from "@/components/ui/Campo";
import { EstadoDaLista } from "@/components/ui/EstadoDaLista";
import { Selo } from "@/components/ui/Selo";
import { useAtualizacao } from "@/contexts/AtualizacaoContext";
import { useAvisos } from "@/contexts/AvisosContext";
import { useAcao } from "@/hooks/useAcao";
import { ATRIBUTOS_DA_PARTIDA_POR_POSICAO, FORMACAO_PADRAO, FORMACOES, rotuloDaPosicao, rotuloDoAtributo, vagasDaFormacao } from "@/lib/dominio";
import { plural } from "@/lib/formatacao";
import { salvarEscalacao } from "@/services/clubes";

import { CampoDaEscalacao } from "./CampoDaEscalacao";
import { MiniFormacao } from "./MiniFormacao";

function podeOcupar(jogador, vaga) {
  return vaga.posicoes.includes(jogador.position) && jogador.condition !== "DOENTE";
}

// Coloca os jogadores escolhidos nas vagas da formação, na ordem do elenco, sem repetir ninguém.
function distribuir(formacao, jogadores) {
  const usados = new Set();
  const titulares = {};
  for (const vaga of vagasDaFormacao(formacao)) {
    const escolhido = jogadores.find((jogador) => !usados.has(jogador.id) && podeOcupar(jogador, vaga));
    if (escolhido) {
      usados.add(escolhido.id);
      titulares[vaga.chave] = escolhido.id;
    }
  }
  return titulares;
}

function selecaoSalva(escalacao) {
  const formacao = escalacao?.formation ?? FORMACAO_PADRAO;
  return { formacao, titulares: distribuir(formacao, escalacao?.players ?? []) };
}

function AtributosUsados({ jogador }) {
  return (
    <span className="flex flex-wrap gap-x-3 text-slate-500">
      {ATRIBUTOS_DA_PARTIDA_POR_POSICAO[jogador.position].map((campo) => (
        <span key={campo}>
          {rotuloDoAtributo(campo)} <span className="font-medium text-slate-900">{jogador[campo]}</span>
        </span>
      ))}
    </span>
  );
}

export function AbaEscalacao({ clube, escalacao }) {
  const avisos = useAvisos();
  const { atualizar } = useAtualizacao();
  const elenco = useMemo(() => clube?.players ?? [], [clube]);
  const [selecao, setSelecao] = useState(() => selecaoSalva(escalacao));
  const { formacao, titulares } = selecao;

  useEffect(() => {
    setSelecao(selecaoSalva(escalacao));
  }, [escalacao]);

  function restaurar() {
    setSelecao(selecaoSalva(escalacao));
  }

  const { executar, enviando, erro } = useAcao(
    (dados) => salvarEscalacao(clube.id, dados),
    (salva) => avisos.sucesso("Escalação salva", `${clube.name} na ${salva.formation}, com os 5 titulares devolvidos pela API.`),
  );

  useEffect(() => {
    // Recusada pela API (por exemplo, um titular ficou DOENTE depois de a tela abrir): elenco e escalação são recarregados.
    if (erro) {
      atualizar();
    }
  }, [erro, atualizar]);

  if (!clube || !escalacao) {
    return <EstadoDaLista titulo="Carregando a escalação..." />;
  }

  const vagas = vagasDaFormacao(formacao);
  const jogadorPorId = new Map(elenco.map((jogador) => [jogador.id, jogador]));
  const jogadorDaVaga = (vaga) => jogadorPorId.get(titulares[vaga.chave]);
  const escolhidos = new Set(Object.values(titulares));
  const completa = vagas.every((vaga) => titulares[vaga.chave]);
  const malCondicionados = vagas.map(jogadorDaVaga).filter((jogador) => jogador?.condition === "MAL_CONDICIONADO");
  const reservas = elenco.filter((jogador) => !escolhidos.has(jogador.id));

  function mudarFormacao(nova) {
    setSelecao({ formacao: nova, titulares: distribuir(nova, elenco.filter((jogador) => escolhidos.has(jogador.id))) });
  }

  function opcoesDaVaga(vaga) {
    return elenco
      .filter((jogador) => podeOcupar(jogador, vaga) && (!escolhidos.has(jogador.id) || titulares[vaga.chave] === jogador.id))
      .map((jogador) => ({ valor: jogador.id, rotulo: `${jogador.name} (${jogador.position})` }));
  }

  function salvar() {
    executar({ formation: formacao, player_ids: vagas.map((vaga) => titulares[vaga.chave]) });
  }

  return (
    <div className="flex flex-col gap-4">
      {!escalacao.complete && (
        <Alerta tipo="aviso" titulo={`Escalação incompleta: o ${clube.name} não pode jogar partidas`}>
          {escalacao.formation
            ? `A formação ${escalacao.formation} continua salva, com ${plural(escalacao.players.length, "titular", "titulares")}. Titular vendido ou que fica Doente sai da escalação; escale de novo para voltar a jogar.`
            : `O elenco tem ${plural(elenco.length, "jogador", "jogadores")}, e a escalação precisa de 5: 1 goleiro e 4 jogadores de linha. Escolha a formação e um titular para cada vaga e salve.`}
        </Alerta>
      )}
      <div className="grid gap-4 xl:grid-cols-[1fr_17rem]">
        <Cartao
          titulo="Titulares"
          descricao="1 goleiro e 4 jogadores de linha, na formação escolhida. Salvar troca os 5 de uma vez."
          acoes={
            escalacao.complete ? (
              <Selo tom="verde" icone={CircleCheck}>Completa</Selo>
            ) : (
              <Selo tom="amarelo" icone={TriangleAlert}>Incompleta</Selo>
            )
          }
        >
          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4">
            <AlertaDeErro erro={erro} titulo="A escalação foi recusada" />
            <div>
              <p className="text-sm font-medium text-slate-900">Formação</p>
              <p className="text-xs text-slate-600">Os números contam os jogadores de linha de trás para frente. O goleiro fica fora da conta.</p>
              <div role="radiogroup" aria-label="Formação" className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {FORMACOES.map((opcao) => {
                  const selecionada = opcao.valor === formacao;
                  return (
                    <label
                      key={opcao.valor}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                        selecionada ? "border-primaria bg-blue-50/60" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <MiniFormacao formacao={opcao.valor} />
                      <span className="text-sm">
                        <span className="flex items-center gap-2 font-semibold text-slate-900">
                          <input type="radio" name="formacao" value={opcao.valor} checked={selecionada} onChange={() => mudarFormacao(opcao.valor)} className="accent-primaria" />
                          {opcao.valor}
                        </span>
                        <span className="text-xs text-slate-600">{opcao.descricao}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  {["Vaga", "Titular", "Condição", "Overall", "Atributos usados"].map((titulo) => (
                    <th key={titulo} scope="col" className={`px-4 py-2.5 font-normal ${titulo === "Overall" ? "text-right" : "text-left"}`}>
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vagas.map((vaga) => {
                  const jogador = jogadorDaVaga(vaga);
                  const opcoes = opcoesDaVaga(vaga);
                  return (
                    <tr key={vaga.chave}>
                      <td className="px-4 py-3">
                        <span className="block font-medium text-slate-900">{vaga.rotulo}</span>
                        <span className="block text-xs text-slate-500">{vaga.descricao}</span>
                      </td>
                      <td className="w-52 px-4 py-3">
                        <Selecao
                          id={`vaga-${vaga.chave}`}
                          aria-label={`Titular da vaga ${vaga.rotulo} (${vaga.descricao})`}
                          opcoes={opcoes}
                          vazia={opcoes.length === 0 ? `Sem ${vaga.descricao} no elenco` : "Escolha o titular"}
                          disabled={opcoes.length === 0}
                          value={titulares[vaga.chave] ?? ""}
                          onChange={(evento) =>
                            setSelecao({ formacao, titulares: { ...titulares, [vaga.chave]: Number(evento.target.value) || undefined } })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">{jogador && <SeloDeCondicao condicao={jogador.condition} />}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{jogador?.overall}</td>
                      <td className="px-4 py-3">{jogador && <AtributosUsados jogador={jogador} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {malCondicionados.length > 0 && (
            <div className="px-5 pt-4">
              <Alerta tipo="aviso" titulo={`${malCondicionados.map((jogador) => jogador.name).join(" e ")} ${malCondicionados.length > 1 ? "estão mal condicionados" : "está mal condicionado"}`}>
                Podem jogar, mas cada atributo vale 15% a menos durante a partida.
              </Alerta>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
            <p className="mr-auto max-w-md text-xs text-slate-600">
              {completa
                ? "A escalação vale até ser trocada. Titular vendido ou que fica doente sai dela, e o clube só volta a jogar depois de escalar de novo."
                : "Escolha a formação e um titular para cada vaga para salvar."}
            </p>
            <Botao variante="secundario" onClick={restaurar} disabled={enviando}>
              Cancelar
            </Botao>
            <Botao onClick={salvar} disabled={!completa} carregando={enviando}>
              {!enviando && <Check className="size-4" />} Salvar escalação
            </Botao>
          </div>
        </Cartao>

        <div className="flex flex-col gap-4">
          <Cartao titulo="Em campo" descricao={`Prévia da formação ${formacao}${completa ? ", do goleiro ao ataque." : "; as vagas vazias ficam tracejadas."}`}>
            <div className="px-4 pb-4">
              <CampoDaEscalacao vagas={vagas} jogadorDaVaga={jogadorDaVaga} />
            </div>
            <p className="flex gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
              <Swords className="size-4 shrink-0" aria-hidden />
              Na partida, atacam os 3 jogadores de linha mais avançados e defendem o goleiro e os 2 mais recuados. É gol quando o ataque é maior que a defesa.
            </p>
          </Cartao>
          <Cartao titulo="Reservas" descricao="Jogadores do elenco fora da escalação.">
            <ul className="divide-y divide-slate-100 border-t border-slate-200">
              {reservas.length === 0 && (
                <li className="px-5 py-4 text-sm text-slate-600">Nenhum reserva: os {plural(elenco.length, "jogador", "jogadores")} do elenco estão escolhidos.</li>
              )}
              {reservas.map((jogador) => (
                <li key={jogador.id} className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar nome={jogador.name} />
                    <span className="flex-1 text-sm">
                      <span className="block font-medium text-slate-900">{jogador.name}</span>
                      <span className="block text-xs text-slate-500">{rotuloDaPosicao(jogador.position)}</span>
                    </span>
                    <SeloDeCondicao condicao={jogador.condition} />
                  </div>
                  {jogador.condition === "DOENTE" && (
                    <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <Lock className="size-3.5" aria-hidden /> Doente não pode ser escalado.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Cartao>
        </div>
      </div>
    </div>
  );
}
