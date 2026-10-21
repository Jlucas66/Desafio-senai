const URL_DA_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export class ErroDaApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = "ErroDaApi";
    this.status = status;
  }
}

function montarUrl(caminho, parametros = {}) {
  const url = new URL(`${URL_DA_API}${caminho}`);
  for (const [nome, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(nome, valor);
    }
  }
  return url;
}

async function enviar(caminho, { metodo = "GET", corpo, parametros } = {}) {
  try {
    return await fetch(montarUrl(caminho, parametros), {
      method: metodo,
      headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi("Não foi possível conectar à API. Confira se o backend está no ar.", 0);
  }
}

async function erroDaResposta(resposta) {
  const corpo = await resposta.json().catch(() => null);
  return new ErroDaApi(corpo?.message ?? `A API respondeu com erro ${resposta.status}.`, resposta.status);
}

export async function requisitar(caminho, opcoes) {
  const resposta = await enviar(caminho, opcoes);
  if (!resposta.ok) {
    throw await erroDaResposta(resposta);
  }
  return resposta.status === 204 ? null : resposta.json();
}
