const TONS = {
  verde: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amarelo: "bg-amber-50 text-amber-700 ring-amber-200",
  vermelho: "bg-red-50 text-red-600 ring-red-200",
  azul: "bg-blue-50 text-primaria ring-blue-200",
  cinza: "bg-slate-100 text-slate-700 ring-slate-200",
  contorno: "bg-white text-slate-900 ring-slate-300",
};

const PONTOS = { verde: "bg-emerald-600", amarelo: "bg-amber-600", vermelho: "bg-red-600", azul: "bg-primaria", cinza: "bg-slate-500" };

export function Selo({ tom = "cinza", ponto = false, icone: Icone, children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${TONS[tom]}`}>
      {ponto && <span className={`size-1.5 rounded-full ${PONTOS[tom]}`} aria-hidden />}
      {Icone && <Icone className="size-3" aria-hidden />}
      {children}
    </span>
  );
}
