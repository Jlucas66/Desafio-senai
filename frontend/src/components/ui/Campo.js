import { CircleAlert } from "lucide-react";

function estiloDaEntrada(erro, comIcone) {
  return `w-full rounded-lg border bg-white py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-3 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
    comIcone ? "pr-3 pl-9" : "px-3"
  } ${erro ? "border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-primaria focus:ring-primaria/15"}`;
}

export function Campo({ id, rotulo, erro, dica, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {rotulo && (
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
          {rotulo}
        </label>
      )}
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="flex items-start gap-1.5 text-xs text-red-600">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {erro}
        </p>
      ) : (
        dica && <p className="text-xs text-slate-500">{dica}</p>
      )}
    </div>
  );
}

export function Entrada({ id, erro, icone: Icone, ...props }) {
  return (
    <div className="relative">
      {Icone && <Icone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden />}
      <input
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={estiloDaEntrada(erro, Boolean(Icone))}
        {...props}
      />
    </div>
  );
}

export function Selecao({ id, erro, opcoes, vazia, icone: Icone, ...props }) {
  return (
    <div className="relative">
      {Icone && <Icone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden />}
      <select
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={estiloDaEntrada(erro, Boolean(Icone))}
        {...props}
      >
        {vazia !== undefined && <option value="">{vazia}</option>}
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor} disabled={opcao.desabilitada}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}
