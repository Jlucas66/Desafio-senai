import { LoaderCircle } from "lucide-react";

const ESTILOS = {
  primario: "bg-primaria text-white hover:bg-primaria-escura",
  secundario: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  perigo: "bg-red-600 text-white hover:bg-red-700",
  discreto: "text-slate-600 hover:bg-slate-100",
};

export function Botao({ variante = "primario", carregando = false, disabled, children, className = "", ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || carregando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${ESTILOS[variante]} ${className}`}
      {...props}
    >
      {carregando && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
