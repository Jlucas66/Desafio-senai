"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({ titulo, descricao, icone, aoFechar, rodape, largura = "max-w-lg", children }) {
  useEffect(() => {
    function fecharComEsc(evento) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [aoFechar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={aoFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-da-janela"
        className={`relative flex max-h-[92vh] w-full flex-col rounded-2xl bg-white shadow-2xl ${largura}`}
        onClick={(evento) => evento.stopPropagation()}
      >
        <button type="button" onClick={aoFechar} aria-label="Fechar janela" className="absolute top-5 right-5 text-slate-500 hover:text-slate-900">
          <X className="size-5" />
        </button>
        <div className="overflow-y-auto px-6 pt-6 pb-5">
          {icone && <div className="mb-4">{icone}</div>}
          <h2 id="titulo-da-janela" className="pr-8 text-lg font-semibold text-slate-900">
            {titulo}
          </h2>
          {descricao && <p className="mt-1 text-sm text-slate-600">{descricao}</p>}
          <div className="mt-5">{children}</div>
        </div>
        {rodape && <div className="mx-6 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 py-4">{rodape}</div>}
      </div>
    </div>
  );
}
