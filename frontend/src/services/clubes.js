import { baixar, requisitar } from "./api";

export function listarClubes(ordenacao) {
  return requisitar("/clubs", { parametros: { sort: ordenacao } });
}

export function buscarClube(id) {
  return requisitar(`/clubs/${id}`);
}

export function criarClube(dados) {
  return requisitar("/clubs", { metodo: "POST", corpo: dados });
}

export function buscarEscalacao(clubeId) {
  return requisitar(`/clubs/${clubeId}/lineup`);
}

export function salvarEscalacao(clubeId, dados) {
  return requisitar(`/clubs/${clubeId}/lineup`, { metodo: "PUT", corpo: dados });
}

export function listarTransacoes(clubeId, filtros) {
  return requisitar(`/clubs/${clubeId}/transactions`, { parametros: filtros });
}

export function exportarTransacoes(clubeId, filtros) {
  return baixar(`/clubs/${clubeId}/transactions/export`, filtros);
}
