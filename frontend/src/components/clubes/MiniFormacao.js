import { FORMACOES } from "@/lib/dominio";

// Desenho pequeno da formação: os setores de cima para baixo (ataque, meio, defesa) e o goleiro embaixo.
export function MiniFormacao({ formacao }) {
  const { setores } = FORMACOES.find((item) => item.valor === formacao);
  const linhas = [setores.ataque, setores.meio, setores.defesa, 1].filter((quantidade) => quantidade > 0);
  return (
    <span className="flex h-9 w-7 shrink-0 flex-col justify-around rounded border border-emerald-900 bg-gramado px-0.5" aria-hidden>
      {linhas.map((quantidade, indice) => (
        <span key={indice} className="flex justify-center gap-0.5">
          {Array.from({ length: quantidade }, (_, ponto) => (
            <span key={ponto} className="size-1 rounded-full bg-white" />
          ))}
        </span>
      ))}
    </span>
  );
}
