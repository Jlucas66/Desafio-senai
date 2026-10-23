const URL_DA_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export const SEM_CONEXAO = 0;

class ErroDaApi extends Error {
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
  let resposta;
  try {
    resposta = await fetch(montarUrl(caminho, parametros), {
      method: metodo,
      headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi("Não foi possível conectar à API. Verifique a conexão e tente de novo.", SEM_CONEXAO);
  }
  if (!resposta.ok) {
    const corpoDoErro = await resposta.json().catch(() => null);
    throw new ErroDaApi(corpoDoErro?.message ?? `A API respondeu com erro ${resposta.status}.`, resposta.status);
  }
  return resposta;
}

export async function requisitar(caminho, opcoes) {
  const resposta = await enviar(caminho, opcoes);
  return resposta.status === 204 ? null : resposta.json();
}

export async function baixar(caminho, parametros) {
  const resposta = await enviar(caminho, { parametros });
  const disposicao = resposta.headers.get("Content-Disposition") ?? "";
  const nomeDoArquivo = /filename="?([^";]+)"?/.exec(disposicao)?.[1] ?? "historico.csv";
  return { conteudo: await resposta.blob(), nomeDoArquivo };
}
