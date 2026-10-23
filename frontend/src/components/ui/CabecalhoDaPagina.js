export function CabecalhoDaPagina({ icone: Icone, titulo, descricao, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {Icone && (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primaria/40 bg-blue-50 text-primaria">
            <Icone className="size-5" aria-hidden />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{titulo}</h1>
          {descricao && <p className="mt-1 text-sm text-slate-600">{descricao}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
