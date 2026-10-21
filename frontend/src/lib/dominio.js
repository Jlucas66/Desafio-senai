export const POSICOES = [
  { valor: "GOL", rotulo: "Goleiro" },
  { valor: "ZAG", rotulo: "Zagueiro" },
  { valor: "LAT", rotulo: "Lateral" },
  { valor: "MEI", rotulo: "Meia" },
  { valor: "ATA", rotulo: "Atacante" },
];

export const CONDICOES = [
  { valor: "APTO", rotulo: "Apto" },
  { valor: "MAL_CONDICIONADO", rotulo: "Mal condicionado" },
  { valor: "DOENTE", rotulo: "Doente" },
];

export const ORDENACOES_DE_JOGADORES = [
  { valor: "name", rotulo: "Nome (A–Z)" },
  { valor: "value_desc", rotulo: "Maior valor de mercado" },
  { valor: "value_asc", rotulo: "Menor valor de mercado" },
  { valor: "age_asc", rotulo: "Mais novos" },
  { valor: "age_desc", rotulo: "Mais velhos" },
  { valor: "position", rotulo: "Posição (GOL → ATA)" },
];

export const ORDENACOES_DE_CLUBES = [
  { valor: "name", rotulo: "Nome (A–Z)" },
  { valor: "net_worth_desc", rotulo: "Maior patrimônio" },
  { valor: "net_worth_asc", rotulo: "Menor patrimônio" },
];

export const INDICADORES = [
  { campo: "pace", rotulo: "Velocidade" },
  { campo: "shooting", rotulo: "Finalização" },
  { campo: "passing", rotulo: "Passe" },
  { campo: "dribbling", rotulo: "Drible" },
  { campo: "defending", rotulo: "Defesa" },
  { campo: "physical", rotulo: "Físico" },
  { campo: "potential", rotulo: "Potencial" },
];

export const JOGADORES_POR_PAGINA = 10;

export function rotuloDaCondicao(condicao) {
  return CONDICOES.find((item) => item.valor === condicao)?.rotulo ?? condicao;
}
