import { corDoAvatar } from "@/lib/cores";
import { iniciais } from "@/lib/formatacao";

const TAMANHOS = { pequeno: "size-8 text-xs", medio: "size-9 text-xs", grande: "size-10 text-sm" };

export function Avatar({ nome, tamanho = "pequeno" }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${TAMANHOS[tamanho]} ${corDoAvatar(nome)}`} aria-hidden>
      {iniciais(nome)}
    </span>
  );
}

export function Sigla({ sigla, grande = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 ${
        grande ? "size-12 text-sm" : "size-9 text-xs"
      }`}
    >
      {sigla}
    </span>
  );
}
