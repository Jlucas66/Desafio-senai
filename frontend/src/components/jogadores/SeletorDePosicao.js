import { POSICOES } from "@/lib/dominio";

export function SeletorDePosicao({ valor, aoMudar, bloqueado = false, erro }) {
  return (
    <div role="radiogroup" aria-label="Posição" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {POSICOES.map((posicao) => {
        const selecionada = valor === posicao.valor;
        return (
          <button
            key={posicao.valor}
            type="button"
            role="radio"
            aria-checked={selecionada}
            disabled={bloqueado && !selecionada}
            onClick={() => aoMudar(posicao.valor)}
            className={`rounded-lg border px-2 py-2.5 text-center transition disabled:cursor-not-allowed disabled:opacity-50 ${
              selecionada ? "border-primaria bg-blue-50 text-primaria" : erro ? "border-red-400" : "border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm font-semibold">{posicao.valor}</span>
            <span className={`block text-xs ${selecionada ? "text-primaria" : "text-slate-500"}`}>{posicao.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}
