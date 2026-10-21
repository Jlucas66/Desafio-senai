import Link from "next/link";

import { Tabela } from "@/components/ui/Tabela";
import { formatarMoeda } from "@/lib/formatacao";

const COLUNAS = [
  {
    titulo: "Nome",
    conteudo: (clube) => (
      <Link href={`/clubes/${clube.id}`} className="font-medium text-primaria hover:underline">
        {clube.name}
      </Link>
    ),
  },
  { titulo: "Sigla", conteudo: (clube) => clube.acronym },
  { titulo: "Caixa", alinhar: "direita", conteudo: (clube) => formatarMoeda(clube.cash) },
  { titulo: "Valor do elenco", alinhar: "direita", conteudo: (clube) => formatarMoeda(clube.squad_value) },
  {
    titulo: "Patrimônio",
    alinhar: "direita",
    conteudo: (clube) => <span className="font-medium text-slate-900">{formatarMoeda(clube.net_worth)}</span>,
  },
];

export function TabelaClubes({ clubes, carregando, erro }) {
  return (
    <Tabela colunas={COLUNAS} itens={clubes} carregando={carregando} erro={erro} mensagemVazia="Nenhum clube cadastrado ainda." />
  );
}
