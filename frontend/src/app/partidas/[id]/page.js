"use client";

import { ArrowLeft, HeartPulse, SearchX, Volleyball } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";

import { CampoDaPartida } from "@/components/partidas/CampoDaPartida";
import { PlacarDaPartida } from "@/components/partidas/PlacarDaPartida";
import { TabelaDuelos } from "@/components/partidas/TabelaDuelos";
import { Cartao } from "@/components/ui/Cartao";
import { EstadoDaLista } from "@/components/ui/EstadoDaLista";
import { useResumoDaLiga } from "@/contexts/ResumoDaLigaContext";
import { useCarregamento } from "@/hooks/useCarregamento";
import { buscarPartida } from "@/services/liga";

export default function PaginaDaPartida() {
  const { id } = useParams();
  const roteador = useRouter();
  const { clubes } = useResumoDaLiga();
  const buscar = useCallback(() => buscarPartida(id), [id]);
  const partida = useCarregamento(buscar);
  const siglaDoClube = (clubeId) => clubes.find((clube) => clube.id === clubeId)?.acronym ?? "";

  if (partida.erro) {
    const naoEncontrada = partida.erro.status === 404;
    return (
      <div className="rounded-2xl border border-slate-200">
        <EstadoDaLista
          tipo={naoEncontrada ? "vazio" : "erro"}
          icone={naoEncontrada ? SearchX : undefined}
          titulo={naoEncontrada ? "Partida não encontrada" : "Não foi possível carregar a partida"}
          texto={partida.erro.message}
          acao={naoEncontrada ? { rotulo: "Voltar para partidas", icone: ArrowLeft, aoClicar: () => roteador.push("/partidas") } : { rotulo: "Tentar de novo", aoClicar: partida.tentarDeNovo }}
        />
      </div>
    );
  }

  if (!partida.dados) {
    return <EstadoDaLista titulo="Carregando a partida..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/partidas" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-900 hover:text-primaria">
        <ArrowLeft className="size-4" /> Voltar para partidas
      </Link>
      <section className="rounded-2xl border border-slate-200 p-5">
        <PlacarDaPartida partida={partida.dados} siglaDoClube={siglaDoClube} />
      </section>
      <Cartao
        titulo="Em campo"
        descricao="Titulares de cada clube na formação da partida e os valores usados nos duelos, já com o efeito da condição."
        acoes={
          <span className="flex gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <HeartPulse className="size-3.5 text-amber-600" aria-hidden /> Mal condicionado
            </span>
            <span className="flex items-center gap-1.5">
              <Volleyball className="size-3.5" aria-hidden /> Gol no duelo
            </span>
          </span>
        }
      >
        <div className="border-t border-slate-200 p-5">
          <CampoDaPartida partida={partida.dados} />
        </div>
      </Cartao>
      <Cartao
        titulo="Duelos"
        descricao="Os 3 ataques do mandante e depois os 3 do visitante. Os jogadores de linha vão do 1º (o mais recuado) ao 4º (o mais avançado), pela ordem do elenco: o 4º ataca o goleiro, o 3º ataca o 1º e o 2º ataca o 2º."
      >
        <TabelaDuelos partida={partida.dados} siglaDoClube={siglaDoClube} />
      </Cartao>
    </div>
  );
}
