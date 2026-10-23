import { requisitar } from "./api";

export function listarPartidas(clubeId) {
  return requisitar("/matches", { parametros: { club_id: clubeId } });
}

export function buscarPartida(id) {
  return requisitar(`/matches/${id}`);
}

export function jogarPartida(dados) {
  return requisitar("/matches", { metodo: "POST", corpo: dados });
}

export function buscarClassificacao() {
  return requisitar("/standings");
}
