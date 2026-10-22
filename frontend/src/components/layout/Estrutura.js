"use client";

import { useState } from "react";

import { BarraLateral } from "./BarraLateral";
import { BarraSuperior } from "./BarraSuperior";

export function Estrutura({ children }) {
  const [menuAbertoNoCelular, setMenuAbertoNoCelular] = useState(false);
  const [menuEscondido, setMenuEscondido] = useState(false);

  function alternarMenu() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setMenuEscondido((atual) => !atual);
    } else {
      setMenuAbertoNoCelular((atual) => !atual);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <aside className={`sticky top-0 hidden h-screen w-56 shrink-0 ${menuEscondido ? "lg:hidden" : "lg:block"}`}>
        <BarraLateral />
      </aside>
      {menuAbertoNoCelular && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <aside className="h-full w-72 bg-slate-100 shadow-xl">
            <BarraLateral aoNavegar={() => setMenuAbertoNoCelular(false)} />
          </aside>
          <button type="button" aria-label="Fechar o menu" className="flex-1 bg-slate-900/40" onClick={() => setMenuAbertoNoCelular(false)} />
        </div>
      )}
      <div className="min-w-0 flex-1 p-0 lg:py-2 lg:pr-2">
        <div className="min-h-full bg-white lg:rounded-2xl lg:border lg:border-slate-200">
          <BarraSuperior aoAlternarMenu={alternarMenu} />
          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
