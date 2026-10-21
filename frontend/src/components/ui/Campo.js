const ESTILO_DA_ENTRADA =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primaria focus:ring-2 focus:ring-primaria/20 disabled:bg-slate-100 disabled:text-slate-500";

function estiloDaEntrada(erro) {
  return `${ESTILO_DA_ENTRADA} ${erro ? "border-red-400" : "border-slate-300"}`;
}

export function Campo({ id, rotulo, erro, dica, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-xs text-red-600">
          {erro}
        </p>
      ) : (
        dica && <p className="text-xs text-slate-500">{dica}</p>
      )}
    </div>
  );
}

export function Entrada({ id, erro, ...props }) {
  return <input id={id} aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : undefined} className={estiloDaEntrada(erro)} {...props} />;
}

export function Selecao({ id, erro, opcoes, vazia, ...props }) {
  return (
    <select id={id} aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : undefined} className={estiloDaEntrada(erro)} {...props}>
      {vazia && <option value="">{vazia}</option>}
      {opcoes.map((opcao) => (
        <option key={opcao.valor} value={opcao.valor} disabled={opcao.desabilitada}>
          {opcao.rotulo}
        </option>
      ))}
    </select>
  );
}
