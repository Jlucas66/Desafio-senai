"use client";

import { CircleCheck, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TEMPO_NA_TELA_EM_MS = 6000;

const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const fechar = useCallback((id) => {
    setAvisos((atuais) => atuais.filter((aviso) => aviso.id !== id));
  }, []);

  const sucesso = useCallback(
    (titulo, mensagem) => {
      const id = crypto.randomUUID();
      setAvisos((atuais) => [...atuais, { id, titulo, mensagem }]);
      setTimeout(() => fechar(id), TEMPO_NA_TELA_EM_MS);
    },
    [fechar],
  );

  const valor = useMemo(() => ({ sucesso }), [sucesso]);

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <div className="fixed right-4 bottom-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} role="status" className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
            <div className="flex-1 text-sm">
              <p className="font-medium text-slate-900">{aviso.titulo}</p>
              <p className="mt-0.5 text-slate-600">{aviso.mensagem}</p>
            </div>
            <button type="button" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso" className="text-slate-400 hover:text-slate-700">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  return useContext(AvisosContext);
}
