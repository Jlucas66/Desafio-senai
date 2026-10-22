import { HeartPulse, Plus } from "lucide-react";

import { iniciais } from "@/lib/formatacao";

const ORDEM_EM_CAMPO = ["ataque", "meio", "defesa", "goleiro"];

function sobrenome(nome) {
  return nome.split(" ").at(-1);
}

function JogadorEmCampo({ jogador, rotuloDaVaga }) {
  return (
    <span className="flex w-20 flex-col items-center gap-1">
      {jogador ? (
        <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-primaria text-xs font-medium text-white">
          {iniciais(jogador.name)}
          {jogador.condition === "MAL_CONDICIONADO" && (
            <span className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-amber-600 text-white" title="Mal condicionado">
              <HeartPulse className="size-2.5" aria-hidden />
            </span>
          )}
        </span>
      ) : (
        <span className="flex size-9 items-center justify-center rounded-full border border-dashed border-white/70 text-white/80">
          <Plus className="size-4" aria-hidden />
        </span>
      )}
      <span className="rounded bg-emerald-950/60 px-1.5 text-xs text-white">{jogador ? sobrenome(jogador.name) : rotuloDaVaga}</span>
    </span>
  );
}

export function CampoDaEscalacao({ vagas, jogadorDaVaga }) {
  const linhas = ORDEM_EM_CAMPO.map((setor) => vagas.filter((vaga) => (vaga.setor ?? "goleiro") === setor)).filter((linha) => linha.length > 0);
  return (
    <div className="relative overflow-hidden rounded-xl bg-[repeating-linear-gradient(to_bottom,var(--color-gramado)_0_2.5rem,var(--color-gramado-claro)_2.5rem_5rem)] px-3 py-6">
      <span className="pointer-events-none absolute inset-3 rounded border border-white/25" aria-hidden />
      <span className="pointer-events-none absolute top-1/2 right-3 left-3 border-t border-white/25" aria-hidden />
      <span className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-1/2 rounded-full border border-white/25" aria-hidden />
      <span className="pointer-events-none absolute bottom-3 left-1/2 h-12 w-36 -translate-x-1/2 border border-b-0 border-white/25" aria-hidden />
      <div className="relative flex flex-col gap-7">
        {linhas.map((linha) => (
          <div key={linha[0].chave} className="flex justify-around">
            {linha.map((vaga) => (
              <JogadorEmCampo key={vaga.chave} jogador={jogadorDaVaga(vaga)} rotuloDaVaga={vaga.rotulo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
