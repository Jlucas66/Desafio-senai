import { HeartPulse, Volleyball } from "lucide-react";

import { abreviacaoDoAtributo } from "@/lib/dominio";
import { iniciais } from "@/lib/formatacao";

const COLUNAS = [["GOL"], ["ZAG", "LAT"], ["MEI"], ["ATA"]];

// Monta os titulares de um clube a partir dos duelos gravados: posição, condição e valores usados, sem recalcular nada.
function titularesDoClube(duelos, clubeId) {
  const porId = new Map();
  function registrar(participante, marcouGol) {
    const atual = porId.get(participante.player_id) ?? { ...participante, valores: {}, gol: false };
    atual.valores[participante.attribute] = participante.value;
    atual.gol = atual.gol || marcouGol;
    porId.set(participante.player_id, atual);
  }
  for (const duelo of duelos) {
    if (duelo.attacking_club_id === clubeId) {
      registrar(duelo.attacker, duelo.goal);
    } else {
      registrar(duelo.defender, false);
    }
  }
  return [...porId.values()];
}

function Titular({ titular, mandante }) {
  const valores = Object.entries(titular.valores)
    .map(([atributo, valor]) => `${abreviacaoDoAtributo(atributo)} ${valor}`)
    .join(" · ");
  return (
    <span className="flex flex-col items-center gap-1 text-center">
      <span
        className={`relative flex size-10 items-center justify-center rounded-full border-2 text-xs font-semibold ${
          mandante ? "border-white bg-primaria text-white" : "border-white bg-white text-slate-900"
        }`}
      >
        {iniciais(titular.player_name)}
        {titular.condition === "MAL_CONDICIONADO" && (
          <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-amber-600 text-white" title="Mal condicionado">
            <HeartPulse className="size-2.5" aria-hidden />
          </span>
        )}
        {titular.gol && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-white text-slate-900" title="Gol no duelo">
            <Volleyball className="size-3" aria-hidden />
          </span>
        )}
      </span>
      <span className="rounded bg-emerald-950/60 px-1.5 text-xs font-medium text-white">{titular.player_name}</span>
      <span className="rounded bg-emerald-950/40 px-1.5 text-[11px] text-white/90">
        {titular.position} · {valores}
      </span>
    </span>
  );
}

function Time({ titulares, mandante }) {
  const colunas = COLUNAS.map((posicoes) => titulares.filter((titular) => posicoes.includes(titular.position)));
  const ordenadas = mandante ? colunas : [...colunas].reverse();
  return (
    <div className="flex flex-1 items-stretch justify-around">
      {ordenadas.map((coluna, indice) => (
        <div key={indice} className="flex flex-col justify-around gap-4">
          {coluna.map((titular) => (
            <Titular key={titular.player_id} titular={titular} mandante={mandante} />
          ))}
        </div>
      ))}
    </div>
  );
}

function RotuloDoTime({ lado, mandante }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950/60 px-3 py-1 text-xs text-white">
      <span className={`size-2.5 rounded-full ${mandante ? "bg-primaria" : "bg-white"}`} aria-hidden />
      <span className="font-medium">{lado.club_name}</span>
      {lado.formation}
      <span className="text-white/70">| ataca {mandante ? "→" : "←"}</span>
    </span>
  );
}

export function CampoDaPartida({ partida }) {
  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[56rem] overflow-hidden rounded-xl bg-[repeating-linear-gradient(to_right,var(--color-gramado)_0_4rem,var(--color-gramado-claro)_4rem_8rem)] p-6">
        <span className="pointer-events-none absolute inset-4 rounded border border-white/25" aria-hidden />
        <span className="pointer-events-none absolute top-4 bottom-4 left-1/2 border-l border-white/25" aria-hidden />
        <span className="pointer-events-none absolute top-1/2 left-1/2 size-28 -translate-1/2 rounded-full border border-white/25" aria-hidden />
        <div className="relative mb-4 flex justify-between">
          <RotuloDoTime lado={partida.home} mandante />
          <RotuloDoTime lado={partida.away} mandante={false} />
        </div>
        <div className="relative flex min-h-72 gap-10">
          <Time titulares={titularesDoClube(partida.duels, partida.home.club_id)} mandante />
          <Time titulares={titularesDoClube(partida.duels, partida.away.club_id)} mandante={false} />
        </div>
      </div>
    </div>
  );
}
