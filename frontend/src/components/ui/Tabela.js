import { EstadoDaLista } from "./EstadoDaLista";

const ALINHAMENTOS = { esquerda: "text-left", direita: "text-right", centro: "text-center" };
const LINHAS_DO_ESQUELETO = 6;

export function Tabela({ colunas, itens, carregando, erro, tentarDeNovo, vazia, tituloDoErro, chaveDoItem = (item) => item.id, destacarLinha }) {
  if (erro) {
    return (
      <EstadoDaLista
        tipo="erro"
        titulo={tituloDoErro}
        texto={erro.message}
        acao={{ rotulo: "Tentar de novo", aoClicar: tentarDeNovo }}
      />
    );
  }
  if (!carregando && itens.length === 0) {
    return <EstadoDaLista {...vazia} />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.titulo || "acoes"} scope="col" className={`px-2.5 py-2.5 font-normal ${ALINHAMENTOS[coluna.alinhar ?? "esquerda"]}`}>
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100" aria-busy={carregando}>
          {carregando
            ? Array.from({ length: LINHAS_DO_ESQUELETO }, (_, indice) => (
                <tr key={indice}>
                  {colunas.map((coluna) => (
                    <td key={coluna.titulo || "acoes"} className="px-2.5 py-4">
                      <span className="block h-3 animate-pulse rounded-full bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))
            : itens.map((item) => (
                <tr key={chaveDoItem(item)} className={destacarLinha?.(item) ? "bg-blue-50/50" : "hover:bg-slate-50/60"}>
                  {colunas.map((coluna) => (
                    <td key={coluna.titulo || "acoes"} className={`px-2.5 py-3 text-slate-700 ${ALINHAMENTOS[coluna.alinhar ?? "esquerda"]}`}>
                      {coluna.conteudo(item)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {carregando && <p className="sr-only">Carregando...</p>}
    </div>
  );
}
