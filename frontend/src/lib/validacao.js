// Validações de um campo só, feitas antes de enviar; as regras que cruzam campos ficam com a API.

export function obrigatorio(mensagem = "Campo obrigatório.") {
  return (valor) => (valor === null || valor === undefined || String(valor).trim() === "" ? mensagem : null);
}

export function textoEntre(minimo, maximo) {
  return (valor) => {
    const tamanho = [...String(valor ?? "").trim().replace(/ {2,}/g, " ")].length;
    return tamanho < minimo || tamanho > maximo ? `Use de ${minimo} a ${maximo} caracteres.` : null;
  };
}

export function inteiroEntre(minimo, maximo, mensagem = `Use um valor de ${minimo} a ${maximo}.`) {
  return (valor) => {
    const numero = Number(valor);
    return !Number.isInteger(numero) || numero < minimo || numero > maximo ? mensagem : null;
  };
}

export function exatamenteLetras(quantidade) {
  return (valor) =>
    new RegExp(`^[A-Z]{${quantidade}}$`).test(valor ?? "")
      ? null
      : `Use exatamente ${quantidade} letras maiúsculas, de A a Z.`;
}

export function validar(valores, regrasPorCampo) {
  const erros = {};
  for (const [campo, regras] of Object.entries(regrasPorCampo)) {
    for (const regra of regras) {
      const erro = regra(valores[campo]);
      if (erro) {
        erros[campo] = erro;
        break;
      }
    }
  }
  return erros;
}
