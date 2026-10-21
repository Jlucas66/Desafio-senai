"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/jogadores", rotulo: "Jogadores" },
  { href: "/clubes", rotulo: "Clubes" },
  { href: "/partidas", rotulo: "Partidas" },
  { href: "/classificacao", rotulo: "Classificação" },
];

export function Cabecalho() {
  const caminhoAtual = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primaria text-lg font-bold text-white">P</span>
          <span className="text-lg font-semibold">Passe</span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((link) => {
            const ativo = caminhoAtual.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  ativo ? "bg-blue-50 text-primaria" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.rotulo}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
