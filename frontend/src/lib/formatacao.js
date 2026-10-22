const FORMATO_MOEDA = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const FORMATO_INTEIRO = new Intl.NumberFormat("pt-BR");

const DATA_HORA_DA_API = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) {
    return "–";
  }
  return FORMATO_MOEDA.format(valor);
}

export function formatarComSinal(valor) {
  if (valor === null || valor === undefined) {
    return "–";
  }
  const sinal = valor > 0 ? "+" : valor < 0 ? "-" : "";
  return `${sinal}${FORMATO_MOEDA.format(Math.abs(valor))}`;
}

export function formatarInteiro(valor) {
  return FORMATO_INTEIRO.format(valor);
}

// A API devolve as datas já em -03:00; a tela só reorganiza o texto, sem converter fuso.
function partesDaDataHora(dataHoraDaApi) {
  const partes = DATA_HORA_DA_API.exec(dataHoraDaApi ?? "");
  if (!partes) {
    return null;
  }
  const [, ano, mes, dia, hora, minuto] = partes;
  return { data: `${dia}/${mes}/${ano}`, hora: `${hora}:${minuto}` };
}

export function formatarData(dataHoraDaApi) {
  return partesDaDataHora(dataHoraDaApi)?.data ?? "–";
}

export function formatarHora(dataHoraDaApi) {
  return partesDaDataHora(dataHoraDaApi)?.hora ?? "";
}

export function formatarDataHora(dataHoraDaApi) {
  const partes = partesDaDataHora(dataHoraDaApi);
  return partes ? `${partes.data}, ${partes.hora}` : "–";
}

// RN01: a data e a hora digitadas são sempre do horário de Brasília e vão para a API com -03:00.
export function paraDataHoraDaApi(data, hora) {
  return `${data}T${hora}-03:00`;
}

export function iniciais(nome) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palavra) => palavra[0].toUpperCase())
    .join("");
}

export function plural(quantidade, singular, pluralDaPalavra) {
  return `${quantidade} ${quantidade === 1 ? singular : pluralDaPalavra}`;
}
