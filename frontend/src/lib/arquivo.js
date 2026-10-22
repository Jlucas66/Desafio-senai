// Entrega ao navegador um arquivo recebido da API (como o CSV do histórico) para ser salvo.
export function salvarArquivo({ conteudo, nomeDoArquivo }) {
  const endereco = URL.createObjectURL(conteudo);
  const link = document.createElement("a");
  link.href = endereco;
  link.download = nomeDoArquivo;
  link.click();
  URL.revokeObjectURL(endereco);
}
