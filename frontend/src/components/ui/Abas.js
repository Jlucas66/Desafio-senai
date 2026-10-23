export function AbasSegmentadas({ abas, selecionada, aoSelecionar }) {
  return (
    <div role="tablist" className="inline-flex rounded-lg bg-slate-100 p-1">
      {abas.map((aba) => (
        <button
          key={aba.valor}
          type="button"
          role="tab"
          aria-selected={selecionada === aba.valor}
          disabled={aba.desabilitada}
          onClick={() => aoSelecionar(aba.valor)}
          className={`rounded-md px-3 py-1 text-sm transition disabled:cursor-not-allowed disabled:text-slate-400 ${
            selecionada === aba.valor ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {aba.rotulo}
          {aba.contador !== undefined && <span className="ml-1.5 text-slate-500">{aba.contador}</span>}
        </button>
      ))}
    </div>
  );
}

export function AbasSublinhadas({ abas, selecionada, aoSelecionar }) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-slate-200">
      {abas.map((aba) => {
        const ativa = selecionada === aba.valor;
        return (
          <button
            key={aba.valor}
            type="button"
            role="tab"
            aria-selected={ativa}
            onClick={() => aoSelecionar(aba.valor)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-1 pb-2.5 text-sm whitespace-nowrap transition ${
              ativa ? "border-primaria font-medium text-slate-900" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {aba.icone && <aba.icone className="size-4" aria-hidden />}
            {aba.rotulo}
            {aba.contador !== undefined && (
              <span className={`rounded-md px-1.5 text-xs ${ativa ? "bg-blue-50 text-primaria" : "bg-slate-100 text-slate-600"}`}>
                {aba.contador}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
