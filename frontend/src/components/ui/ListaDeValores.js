export function ListaDeValores({ itens }) {
  return (
    <dl className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
      {itens.map((item) => (
        <div key={item.rotulo} className={`flex items-center justify-between gap-4 px-4 py-3 ${item.destaque ? "bg-slate-50" : ""}`}>
          <dt>
            <span className={item.destaque ? "font-semibold text-slate-900" : "text-slate-700"}>{item.rotulo}</span>
            {item.detalhe && <span className="block text-xs text-slate-500">{item.detalhe}</span>}
          </dt>
          <dd className={`text-right ${item.destaque ? "text-lg font-semibold text-slate-900" : "text-slate-900"}`}>{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
