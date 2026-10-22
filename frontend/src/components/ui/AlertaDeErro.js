import { SEM_CONEXAO } from "@/services/api";

import { Alerta } from "./Alerta";

// Mostra o message devolvido pela API no lugar da ação; sem resposta da API, avisa que não houve conexão.
export function AlertaDeErro({ erro, titulo }) {
  if (!erro) {
    return null;
  }
  return (
    <Alerta tipo="erro" titulo={erro.status === SEM_CONEXAO ? "Sem conexão" : titulo}>
      {erro.message}
    </Alerta>
  );
}
