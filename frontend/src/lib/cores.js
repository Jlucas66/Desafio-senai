const CORES_DE_AVATAR = [
  "bg-slate-100 text-slate-600",
  "bg-pink-50 text-pink-600",
  "bg-cyan-50 text-cyan-700",
  "bg-violet-50 text-violet-600",
  "bg-teal-50 text-teal-700",
  "bg-amber-50 text-amber-700",
];

// A cor do avatar é escolhida pelo nome, para o mesmo jogador ter sempre a mesma cor.
export function corDoAvatar(nome) {
  let soma = 0;
  for (const caractere of nome) {
    soma += caractere.codePointAt(0);
  }
  return CORES_DE_AVATAR[soma % CORES_DE_AVATAR.length];
}

// RN03: agilidade de 1 a 30 aumenta o desconto, de 80 a 100 corta pela metade; a cor só destaca essas faixas.
export function corDaAgilidade(agilidade) {
  if (agilidade <= 30) {
    return "bg-red-500";
  }
  if (agilidade >= 80) {
    return "bg-emerald-600";
  }
  return "bg-slate-500";
}

export function tomDoPercentualDeMulta(percentual) {
  if (percentual === 0) {
    return "verde";
  }
  return percentual === 20 ? "vermelho" : "amarelo";
}
