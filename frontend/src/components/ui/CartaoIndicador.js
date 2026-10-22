export function CartaoIndicador({ rotulo, valor, unidade, legenda, icone: Icone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between text-sm text-slate-600">
        {rotulo}
        {Icone && <Icone className="size-4" aria-hidden />}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {valor}
        {unidade && <span className="ml-1.5 text-sm font-normal text-slate-500">{unidade}</span>}
      </p>
      {legenda && <p className="mt-2 text-xs text-slate-500">{legenda}</p>}
    </div>
  );
}
