"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Menu({ rotulo, icone: Icone, ativo = false, desabilitado = false, alinhamento = "esquerda", largura = "w-60", seta = true, rotuloAcessivel, children }) {
  const [aberto, setAberto] = useState(false);
  const referencia = useRef(null);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }
    function fecharAoClicarFora(evento) {
      if (!referencia.current?.contains(evento.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, [aberto]);

  return (
    <div ref={referencia} className="relative">
      <button
        type="button"
        disabled={desabilitado}
        aria-expanded={aberto}
        aria-label={rotuloAcessivel}
        onClick={() => setAberto((atual) => !atual)}
        className={`inline-flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm whitespace-nowrap transition disabled:cursor-not-allowed disabled:text-slate-400 ${
          ativo ? "border-slate-400 text-slate-900" : "border-slate-300 text-slate-700 hover:bg-slate-50"
        }`}
      >
        {Icone && <Icone className="size-4 shrink-0" aria-hidden />}
        {rotulo && <span className="flex-1 text-left">{rotulo}</span>}
        {seta && <ChevronDown className="size-4 shrink-0 text-slate-500" aria-hidden />}
      </button>
      {aberto && (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ${largura} ${
            alinhamento === "direita" ? "right-0" : "left-0"
          }`}
          onClick={(evento) => evento.target.closest("[data-fecha-menu]") && setAberto(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function TituloDoMenu({ children }) {
  return <p className="px-2.5 pt-1 pb-1.5 text-xs text-slate-500">{children}</p>;
}

export function ItemDoMenu({ icone: Icone, selecionado = false, perigo = false, desabilitado = false, dica, onClick, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      data-fecha-menu
      disabled={desabilitado}
      onClick={onClick}
      className={`flex w-full flex-col rounded-lg px-2.5 py-1.5 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
        selecionado ? "bg-slate-100" : "hover:bg-slate-100"
      } ${perigo ? "text-red-600" : "text-slate-900"}`}
    >
      <span className="flex items-center gap-2">
        {Icone && <Icone className="size-4 shrink-0" aria-hidden />}
        {children}
      </span>
      {dica && <span className="mt-1 text-xs text-slate-500">{dica}</span>}
    </button>
  );
}

export function SeparadorDoMenu() {
  return <hr className="my-1 border-slate-100" />;
}
