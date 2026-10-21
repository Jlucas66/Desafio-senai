import { requisitar } from "./api";

export function listarClubes(ordenacao) {
  return requisitar("/clubs", { parametros: { sort: ordenacao } });
}

export function buscarClube(id) {
  return requisitar(`/clubs/${id}`);
}

export function criarClube(dados) {
  return requisitar("/clubs", { metodo: "POST", corpo: dados });
}
