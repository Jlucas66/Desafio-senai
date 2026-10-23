import { ATRIBUTOS } from "@/lib/dominio";

// Desenha os valores informados; a faixa clara vai até o potencial. Não calcula overall nem valor base.
export function BarrasDeAtributos({ atributos, potencial, compacto = false }) {
  return (
    <ul className={compacto ? "flex flex-col gap-2" : "flex flex-col gap-3"}>
      {ATRIBUTOS.map((atributo) => {
        const valor = Number(atributos[atributo.campo]) || 0;
        return (
          <li key={atributo.campo} className={`grid items-center gap-3 ${compacto ? "grid-cols-[5.5rem_1fr_1.75rem] text-xs" : "grid-cols-[6.5rem_1fr_2rem] text-sm"}`}>
            <span className="text-slate-600">{atributo.rotulo}</span>
            <span className="relative h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
              <span className="absolute inset-y-0 left-0 rounded-full bg-blue-200" style={{ width: `${Math.min(Number(potencial) || 0, 99)}%` }} />
              <span className="absolute inset-y-0 left-0 rounded-full bg-primaria" style={{ width: `${Math.min(valor, 99)}%` }} />
            </span>
            <span className="text-right font-medium text-slate-900">{valor}</span>
          </li>
        );
      })}
    </ul>
  );
}
