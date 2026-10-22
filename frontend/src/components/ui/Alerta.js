import { CircleAlert, Info, TriangleAlert } from "lucide-react";

const ESTILOS = {
  erro: { caixa: "border-red-200 bg-red-50 text-red-700", icone: CircleAlert },
  aviso: { caixa: "border-amber-300 bg-amber-50 text-amber-800", icone: TriangleAlert },
  info: { caixa: "border-slate-200 bg-slate-50 text-slate-600", icone: Info },
};

export function Alerta({ tipo = "info", titulo, children }) {
  const { caixa, icone: Icone } = ESTILOS[tipo];
  return (
    <div role={tipo === "erro" ? "alert" : undefined} className={`flex gap-3 rounded-xl border p-4 text-sm ${caixa}`}>
      <Icone className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        {titulo && <p className="font-medium">{titulo}</p>}
        <div className={titulo ? "mt-0.5" : undefined}>{children}</div>
      </div>
    </div>
  );
}
