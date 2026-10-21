import { ArrowRight, History, Repeat, ShieldHalf, ShoppingCart, Trophy, Users } from "lucide-react";
import Link from "next/link";

const ETAPAS = [
  { icone: Users, titulo: "Jogadores", texto: "Nascem livres e aptos; o valor de mercado vem da condição, agilidade e idade.", href: "/jogadores" },
  { icone: ShieldHalf, titulo: "Clubes", texto: "Começam com 300,00 em caixa e sem jogadores.", href: "/clubes" },
  { icone: ShoppingCart, titulo: "Compra", texto: "Valor + taxa, até 50% do caixa, com contrato de fidelidade.", href: "/jogadores" },
  { icone: Repeat, titulo: "Venda", texto: "Multa antes do fim da fidelidade e comissão sobre o lucro.", href: "/clubes" },
  { icone: History, titulo: "Histórico", texto: "Toda compra e venda fica registrada, com totais e CSV.", href: "/clubes" },
  { icone: Trophy, titulo: "Liga", texto: "Escale 5 titulares e jogue partidas que entram na classificação.", href: "/partidas" },
];

export default function Inicio() {
  return (
    <section className="flex flex-col items-center gap-10 py-6 text-center">
      <div className="flex max-w-3xl flex-col items-center gap-5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primaria text-3xl font-bold text-white">P</span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Gestão da liga, do mercado à classificação</h1>
        <p className="text-slate-600 sm:text-lg">
          Cadastre jogadores, monte os clubes e negocie com contrato de fidelidade. Depois, escale os titulares e jogue
          partidas com placar calculado pelos atributos.
        </p>
        <Link
          href="/jogadores"
          className="inline-flex items-center gap-2 rounded-lg bg-primaria px-8 py-3 font-medium text-white transition hover:bg-primaria-escura"
        >
          Iniciar <ArrowRight className="size-4" />
        </Link>
      </div>
      <ol className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {ETAPAS.map((etapa, indice) => (
          <li key={etapa.titulo}>
            <Link
              href={etapa.href}
              className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-primaria/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primaria">
                  <etapa.icone className="size-4" />
                </span>
                <span className="font-mono text-xs">{String(indice + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="font-semibold text-slate-900">{etapa.titulo}</h2>
              <p className="text-sm text-slate-600">{etapa.texto}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
