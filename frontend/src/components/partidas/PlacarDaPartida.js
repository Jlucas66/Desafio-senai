import { Sigla } from "@/components/ui/Avatar";
import { formatarDataHora } from "@/lib/formatacao";

import { ROTULO_DO_RESULTADO } from "./rotulos";

function Lado({ lado, papel, sigla, alinhamento }) {
  const direita = alinhamento === "direita";
  return (
    <div className={`flex flex-1 items-center gap-3 ${direita ? "justify-end text-right" : "flex-row-reverse justify-end text-left"}`}>
      <div>
        <p className="font-semibold text-slate-900">{lado.club_name}</p>
        <p className="text-xs text-slate-500">
          {papel}
          {lado.formation && ` · ${lado.formation}`}
        </p>
      </div>
      <Sigla sigla={sigla} grande />
    </div>
  );
}

export function PlacarDaPartida({ partida, siglaDoClube }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Lado lado={partida.home} papel="Mandante" sigla={siglaDoClube(partida.home.club_id)} alinhamento="direita" />
      <div className="flex flex-col items-center gap-1.5">
        <span className="rounded-lg bg-slate-100 px-4 py-1.5 text-2xl font-semibold text-slate-900">
          {partida.home.goals} × {partida.away.goals}
        </span>
        <span className="text-xs text-slate-500">{formatarDataHora(partida.played_at)}</span>
        <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-900">{ROTULO_DO_RESULTADO[partida.result]}</span>
      </div>
      <Lado lado={partida.away} papel="Visitante" sigla={siglaDoClube(partida.away.club_id)} alinhamento="esquerda" />
    </div>
  );
}
