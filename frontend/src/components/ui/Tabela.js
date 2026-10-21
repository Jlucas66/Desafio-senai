import { CircleAlert, Inbox, LoaderCircle } from "lucide-react";

const ALINHAMENTOS = { esquerda: "text-left", direita: "text-right", centro: "text-center" };

function LinhaDeEstado({ colunas, children }) {
  return (
    <tr>
      <td colSpan={colunas} className="px-4 py-10 text-center text-sm text-slate-500">
        <div className="flex flex-col items-center gap-2">{children}</div>
      </td>
    </tr>
  );
}

export function Tabela({ colunas, itens, carregando, erro, mensagemVazia, chaveDoItem = (item) => item.id }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-max text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.titulo} scope="col" className={`px-4 py-3 font-medium ${ALINHAMENTOS[coluna.alinhar ?? "esquerda"]}`}>
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {carregando ? (
            <LinhaDeEstado colunas={colunas.length}>
              <LoaderCircle className="size-5 animate-spin text-primaria" aria-hidden />
              Carregando...
            </LinhaDeEstado>
          ) : erro ? (
            <LinhaDeEstado colunas={colunas.length}>
              <CircleAlert className="size-5 text-red-500" aria-hidden />
              <span className="text-red-700">{erro.message}</span>
            </LinhaDeEstado>
          ) : itens.length === 0 ? (
            <LinhaDeEstado colunas={colunas.length}>
              <Inbox className="size-5" aria-hidden />
              {mensagemVazia}
            </LinhaDeEstado>
          ) : (
            itens.map((item) => (
              <tr key={chaveDoItem(item)} className="hover:bg-slate-50/70">
                {colunas.map((coluna) => (
                  <td key={coluna.titulo} className={`px-4 py-3 text-slate-700 ${ALINHAMENTOS[coluna.alinhar ?? "esquerda"]}`}>
                    {coluna.conteudo(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
