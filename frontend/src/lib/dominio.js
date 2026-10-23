export const POSICOES = [
  { valor: "GOL", rotulo: "Goleiro" },
  { valor: "ZAG", rotulo: "Zagueiro" },
  { valor: "LAT", rotulo: "Lateral" },
  { valor: "MEI", rotulo: "Meio-campo" },
  { valor: "ATA", rotulo: "Atacante" },
];

export const CONDICOES = [
  { valor: "APTO", rotulo: "Apto", descricao: "Sem desconto por condição." },
  {
    valor: "MAL_CONDICIONADO",
    rotulo: "Mal condicionado",
    descricao: "Desconto de 15%. Agilidade de 80 a 100 corta pela metade; de 1 a 30 soma 10 pontos.",
  },
  { valor: "DOENTE", rotulo: "Doente", descricao: "Desconto de 30%, com o mesmo ajuste de agilidade." },
];

export const ORDENACOES_DE_JOGADORES = [
  { valor: "name", rotulo: "Nome", curto: "nome" },
  { valor: "value_desc", rotulo: "Maior valor de mercado", curto: "maior valor de mercado" },
  { valor: "value_asc", rotulo: "Menor valor de mercado", curto: "menor valor de mercado" },
  { valor: "age_desc", rotulo: "Maior idade", curto: "maior idade" },
  { valor: "age_asc", rotulo: "Menor idade", curto: "menor idade" },
  { valor: "position", rotulo: "Posição (GOL a ATA)", curto: "posição" },
];

export const ORDENACOES_DE_CLUBES = [
  { valor: "name", rotulo: "Nome", curto: "nome" },
  { valor: "net_worth_desc", rotulo: "Patrimônio (maior para o menor)", curto: "patrimônio (maior para o menor)" },
  { valor: "net_worth_asc", rotulo: "Patrimônio (menor para o maior)", curto: "patrimônio (menor para o maior)" },
];

export const ATRIBUTOS = [
  { campo: "pace", rotulo: "Velocidade", curto: "Vel" },
  { campo: "shooting", rotulo: "Finalização", curto: "Fin" },
  { campo: "passing", rotulo: "Passe", curto: "Pas" },
  { campo: "dribbling", rotulo: "Drible", curto: "Dri" },
  { campo: "defending", rotulo: "Defesa", curto: "Def" },
  { campo: "physical", rotulo: "Físico", curto: "Fís" },
];

// RN20: atributos que cada posição usa nos duelos (o atacante pela posição, o defensor sempre pela defesa).
export const ATRIBUTOS_DA_PARTIDA_POR_POSICAO = {
  GOL: ["defending"],
  ZAG: ["dribbling", "defending"],
  LAT: ["dribbling", "defending"],
  MEI: ["passing"],
  ATA: ["shooting"],
};

// RN19: setores da formação, de trás para frente; o goleiro fica fora da conta.
const SETORES = {
  defesa: { rotulo: "Defesa", posicoes: ["ZAG", "LAT"], descricao: "ZAG ou LAT" },
  meio: { rotulo: "Meio", posicoes: ["MEI"], descricao: "MEI" },
  ataque: { rotulo: "Ataque", posicoes: ["ATA"], descricao: "ATA" },
};

export const FORMACOES = [
  { valor: "3-1", setores: { defesa: 3, meio: 0, ataque: 1 }, descricao: "Defesa 3, ataque 1" },
  { valor: "2-2", setores: { defesa: 2, meio: 0, ataque: 2 }, descricao: "Defesa 2, ataque 2" },
  { valor: "2-1-1", setores: { defesa: 2, meio: 1, ataque: 1 }, descricao: "Defesa 2, meio 1, ataque 1" },
  { valor: "1-2-1", setores: { defesa: 1, meio: 2, ataque: 1 }, descricao: "Defesa 1, meio 2, ataque 1" },
];

export const FORMACAO_PADRAO = "2-1-1";
export const JOGADORES_POR_PAGINA = 10;
export const MAXIMO_DO_ELENCO = 12;
export const MAXIMO_DE_CLUBES = 20;

export function vagasDaFormacao(formacao) {
  const { setores } = FORMACOES.find((item) => item.valor === formacao);
  const vagas = [{ chave: "goleiro", rotulo: "Goleiro", descricao: "GOL", posicoes: ["GOL"] }];
  for (const [setor, quantidade] of Object.entries(setores)) {
    for (let indice = 0; indice < quantidade; indice++) {
      vagas.push({ chave: `${setor}-${indice}`, setor, ...SETORES[setor] });
    }
  }
  return vagas;
}

export function rotuloDaPosicao(posicao) {
  return POSICOES.find((item) => item.valor === posicao)?.rotulo ?? posicao;
}

export function rotuloDaCondicao(condicao) {
  return CONDICOES.find((item) => item.valor === condicao)?.rotulo ?? condicao;
}

export function rotuloDoAtributo(campo) {
  return ATRIBUTOS.find((item) => item.campo === campo)?.rotulo ?? campo;
}

export function abreviacaoDoAtributo(campo) {
  return ATRIBUTOS.find((item) => item.campo === campo)?.curto ?? campo;
}
