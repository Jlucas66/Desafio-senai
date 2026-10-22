import { ChevronLeft, ChevronRight } from "lucide-react";

export function Paginacao({ pagina, totalDePaginas, aoMudar }) {
  const paginas = Array.from({ length: totalDePaginas }, (_, indice) => indice + 1);
  return (
    <nav aria-label="Paginação" className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => aoMudar(pagina - 1)}
        disabled={pagina <= 1}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-slate-900 disabled:text-slate-400"
      >
        <ChevronLeft className="size-4" aria-hidden /> Anterior
      </button>
      {paginas.map((numero) => (
        <button
          key={numero}
          type="button"
          aria-current={numero === pagina ? "page" : undefined}
          onClick={() => aoMudar(numero)}
          className={`min-w-9 rounded-lg px-2.5 py-1.5 ${numero === pagina ? "border border-slate-200 bg-white font-medium shadow-xs" : "text-slate-900 hover:bg-slate-100"}`}
        >
          {numero}
        </button>
      ))}
      <button
        type="button"
        onClick={() => aoMudar(pagina + 1)}
        disabled={pagina >= totalDePaginas}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 disabled:font-normal disabled:text-slate-400"
      >
        Próxima <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
