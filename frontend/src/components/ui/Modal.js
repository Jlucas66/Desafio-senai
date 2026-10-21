"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({ titulo, aoFechar, children, largura = "max-w-lg" }) {
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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" onClick={aoFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-do-modal"
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${largura}`}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="titulo-do-modal" className="text-lg font-semibold text-slate-900">
            {titulo}
          </h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
