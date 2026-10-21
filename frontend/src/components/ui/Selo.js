const TONS = {
  verde: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amarelo: "bg-amber-50 text-amber-700 ring-amber-200",
  vermelho: "bg-red-50 text-red-700 ring-red-200",
  azul: "bg-blue-50 text-primaria ring-blue-200",
  cinza: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function Selo({ tom = "cinza", children }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONS[tom]}`}>{children}</span>;
}
