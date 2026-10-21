import { ChevronLeft, ChevronRight } from "lucide-react";

import { Botao } from "./Botao";

export function Paginacao({ pagina, totalDePaginas, totalDeItens, rotuloDosItens, aoMudar }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <p>
        <strong className="font-semibold text-slate-900">{totalDeItens}</strong> {rotuloDosItens}
      </p>
      <div className="flex items-center gap-2">
        <Botao variante="secundario" onClick={() => aoMudar(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </Botao>
        <span>
          Página {totalDePaginas === 0 ? 0 : pagina} de {totalDePaginas}
        </span>
        <Botao variante="secundario" onClick={() => aoMudar(pagina + 1)} disabled={pagina >= totalDePaginas} aria-label="Próxima página">
          <ChevronRight className="size-4" />
        </Botao>
      </div>
    </div>
  );
}
