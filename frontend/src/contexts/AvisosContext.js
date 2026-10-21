"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TEMPO_NA_TELA_EM_MS = 6000;

const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const fechar = useCallback((id) => {
    setAvisos((atuais) => atuais.filter((aviso) => aviso.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo, mensagem) => {
      const id = crypto.randomUUID();
      setAvisos((atuais) => [...atuais, { id, tipo, mensagem }]);
      setTimeout(() => fechar(id), TEMPO_NA_TELA_EM_MS);
    },
    [fechar],
  );

  const api = useMemo(
    () => ({
      sucesso: (mensagem) => mostrar("sucesso", mensagem),
      erro: (mensagem) => mostrar("erro", mensagem),
    }),
    [mostrar],
  );

  return (
    <AvisosContext.Provider value={api}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            role={aviso.tipo === "erro" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-xl border bg-white p-4 text-sm shadow-lg ${
              aviso.tipo === "erro" ? "border-red-200 text-red-800" : "border-emerald-200 text-emerald-800"
            }`}
          >
            {aviso.tipo === "erro" ? (
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
            ) : (
              <CircleCheck className="mt-0.5 size-4 shrink-0" />
            )}
            <p className="flex-1">{aviso.mensagem}</p>
            <button type="button" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso" className="text-slate-400 hover:text-slate-600">
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
