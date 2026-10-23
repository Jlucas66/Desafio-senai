export function Cartao({ titulo, descricao, acoes, children, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
      {(titulo || acoes) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            {titulo && <h2 className="font-semibold text-slate-900">{titulo}</h2>}
            {descricao && <p className="mt-0.5 text-xs text-slate-600">{descricao}</p>}
          </div>
          {acoes}
        </div>
      )}
      {children}
    </section>
  );
}
