export function Indicador({ rotulo, valor, destaque = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{rotulo}</p>
      <p className={`mt-1 text-xl font-semibold ${destaque ? "text-primaria" : "text-slate-900"}`}>{valor}</p>
    </div>
  );
}
