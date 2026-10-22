export const ROTULO_DO_RESULTADO = {
  MANDANTE: "Vitória do mandante",
  VISITANTE: "Vitória do visitante",
  EMPATE: "Empate",
};

// RN20, tabela "Quem ataca e quem defende": a ordem do duelo diz quem são o atacante e o defensor.
const PAPEIS_DO_DUELO = {
  1: { atacante: "4º de linha", defensor: "Goleiro" },
  2: { atacante: "3º de linha", defensor: "1º de linha" },
  3: { atacante: "2º de linha", defensor: "2º de linha" },
};

export function papeisDoDuelo(ordem) {
  return PAPEIS_DO_DUELO[((ordem - 1) % 3) + 1];
}
