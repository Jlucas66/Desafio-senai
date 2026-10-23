import { LoaderCircle } from "lucide-react";

const ESTILOS = {
  primario: "bg-primaria text-white hover:bg-primaria-escura disabled:bg-primaria/50",
  secundario: "border border-slate-200 bg-white text-slate-900 shadow-xs hover:bg-slate-50",
  perigo: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50",
  link: "px-0 text-primaria hover:underline",
  discreto: "text-slate-700 hover:bg-slate-100",
};

export function Botao({ variante = "primario", carregando = false, disabled, children, className = "", ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || carregando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition disabled:cursor-not-allowed ${ESTILOS[variante]} ${className}`}
      {...props}
    >
      {carregando && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
