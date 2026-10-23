import { requisitar } from "./api";

export function listarJogadores(parametros) {
  return requisitar("/players", { parametros });
}

export function cadastrarJogador(dados) {
  return requisitar("/players", { metodo: "POST", corpo: dados });
}

export function editarJogador(id, dados) {
  return requisitar(`/players/${id}`, { metodo: "PUT", corpo: dados });
}

export function alterarCondicao(id, condicao) {
  return requisitar(`/players/${id}/condition`, { metodo: "PATCH", corpo: { condition: condicao } });
}

export function excluirJogador(id) {
  return requisitar(`/players/${id}`, { metodo: "DELETE" });
}
