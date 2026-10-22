import { rotuloDaPosicao } from "@/lib/dominio";

import { Avatar } from "./Avatar";

export function ResumoDoJogador({ jogador, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Avatar nome={jogador.name} tamanho="medio" />
      <div className="flex-1">
        <p className="font-medium text-slate-900">{jogador.name}</p>
        <p className="text-xs text-slate-600">
          {jogador.position} · {rotuloDaPosicao(jogador.position)} · {jogador.age} anos
        </p>
      </div>
      {children}
    </div>
  );
}
