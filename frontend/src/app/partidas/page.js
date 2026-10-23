"use client";

import { ChevronRight, Plus, ShieldHalf, Swords } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

import { FormularioPartida } from "@/components/partidas/FormularioPartida";
import { PlacarDaPartida } from "@/components/partidas/PlacarDaPartida";
import { TabelaPartidas } from "@/components/partidas/TabelaPartidas";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoDaPagina } from "@/components/ui/CabecalhoDaPagina";
import { ItemDoMenu, Menu, TituloDoMenu } from "@/components/ui/Menu";
import { useAvisos } from "@/contexts/AvisosContext";
import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";
import { useCarregamento } from "@/hooks/useCarregamento";
import { plural } from "@/lib/formatacao";
import { listarPartidas } from "@/services/liga";

function PaginaDePartidas() {
  const parametrosDaUrl = useSearchParams();
  const roteador = useRouter();
  const avisos = useAvisos();
  const { clubes, partidas: todasAsPartidas } = useResumoDaLiga();
  const [clubeId, setClubeId] = useState("");
  const [jogando, setJogando] = useState(parametrosDaUrl.get("nova") === "1");

  const buscar = useCallback(() => listarPartidas(clubeId), [clubeId]);
  const partidas = useCarregamento(buscar);
  const siglaDoClube = (id) => clubes.find((clube) => clube.id === id)?.acronym ?? "";
  const ultimaPartida = todasAsPartidas[0];
  const nomeDoFiltro = clubes.find((clube) => String(clube.id) === clubeId)?.name;

  function concluirPartida(partida) {
    setJogando(false);
    avisos.sucesso(
      "Partida jogada",
      `${partida.home.club_name} ${partida.home.goals} × ${partida.away.goals} ${partida.away.club_name}. Placar e duelos devolvidos pela API.`,
    );
    roteador.push(`/partidas/${partida.id}`);
  }

  return (
    <>
      <CabecalhoDaPagina icone={Swords} titulo="Partidas" descricao="Jogue partidas entre clubes com os 5 titulares escalados e acompanhe o histórico.">
        <Botao onClick={() => setJogando(true)}>
          <Plus className="size-4" /> Nova partida
        </Botao>
      </CabecalhoDaPagina>

      {ultimaPartida && (
        <>
          <p className="mb-2 text-sm text-slate-600">Última partida</p>
          <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-5">
            <div className="flex-1">
              <PlacarDaPartida partida={ultimaPartida} siglaDoClube={siglaDoClube} />
            </div>
            <Link
              href={`/partidas/${ultimaPartida.id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Ver duelos <ChevronRight className="size-4" aria-hidden />
            </Link>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="font-semibold text-slate-900">Histórico de partidas</h2>
            <p className="text-xs text-slate-600">Da mais recente para a mais antiga.</p>
          </div>
          <div className="w-60">
            <Menu icone={ShieldHalf} rotulo={`Clube: ${nomeDoFiltro ?? "todos"}`} alinhamento="direita">
              <TituloDoMenu>Mandante ou visitante</TituloDoMenu>
              <ItemDoMenu selecionado={clubeId === ""} onClick={() => setClubeId("")}>
                Todos
              </ItemDoMenu>
              {clubes.map((clube) => (
                <ItemDoMenu key={clube.id} selecionado={String(clube.id) === clubeId} onClick={() => setClubeId(String(clube.id))}>
                  {clube.name}
                </ItemDoMenu>
              ))}
            </Menu>
          </div>
        </div>
        <TabelaPartidas
          partidas={partidas.dados ?? []}
          carregando={partidas.carregando}
          erro={partidas.erro}
          tentarDeNovo={partidas.tentarDeNovo}
          siglaDoClube={siglaDoClube}
          aoNova={clubeId ? undefined : () => setJogando(true)}
        />
        {partidas.dados?.length > 0 && (
          <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{plural(partidas.dados.length, "partida", "partidas")}</p>
        )}
      </section>

      {jogando && <FormularioPartida clubes={clubes} aoFechar={() => setJogando(false)} aoJogar={concluirPartida} />}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <PaginaDePartidas />
    </Suspense>
  );
}
