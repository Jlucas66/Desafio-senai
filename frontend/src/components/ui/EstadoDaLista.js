import { Inbox, RefreshCw, ServerCrash } from "lucide-react";

import { Botao } from "./Botao";

export function EstadoDaLista({ tipo = "vazio", icone, titulo, texto, acao }) {
  const Icone = icone ?? (tipo === "erro" ? ServerCrash : Inbox);
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center" role={tipo === "erro" ? "alert" : undefined}>
      <span className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icone className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-semibold text-slate-900">{titulo}</p>
      {texto && <p className={`mt-2 max-w-md text-sm ${tipo === "erro" ? "text-red-700" : "text-slate-600"}`}>{texto}</p>}
      {acao && (
        <Botao variante="secundario" className="mt-4" onClick={acao.aoClicar}>
          {tipo === "erro" ? <RefreshCw className="size-4" /> : acao.icone && <acao.icone className="size-4" />}
          {acao.rotulo}
        </Botao>
      )}
    </div>
  );
}
