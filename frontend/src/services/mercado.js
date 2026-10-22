import { requisitar } from "./api";

export function comprarJogador(jogadorId, dados) {
  return requisitar(`/players/${jogadorId}/buy`, { metodo: "POST", corpo: dados });
}

export function venderJogador(jogadorId) {
  return requisitar(`/players/${jogadorId}/sell`, { metodo: "POST" });
}
