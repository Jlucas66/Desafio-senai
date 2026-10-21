const FORMATO_MOEDA = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DATA_HORA_DA_API = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) {
    return "—";
  }
  return FORMATO_MOEDA.format(valor);
}

export function formatarVariacao(valor) {
  const sinal = valor > 0 ? "+" : valor < 0 ? "-" : "";
  return `${sinal}${formatarMoeda(Math.abs(valor))}`;
}

// A API devolve as datas já em -03:00; a tela só reorganiza o texto, sem converter fuso.
export function formatarDataHora(dataHoraDaApi) {
  const partes = DATA_HORA_DA_API.exec(dataHoraDaApi ?? "");
  if (!partes) {
    return "—";
  }
  const [, ano, mes, dia, hora, minuto] = partes;
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// RN01: a data digitada no campo datetime-local é sempre interpretada no horário de Brasília.
export function paraDataHoraDaApi(valorDoCampo) {
  return `${valorDoCampo}-03:00`;
}
