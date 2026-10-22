import { ChevronRight, Plus, ShieldHalf } from "lucide-react";
import Link from "next/link";

import { Sigla } from "@/components/ui/Avatar";
import { Selo } from "@/components/ui/Selo";
import { Tabela } from "@/components/ui/Tabela";
import { formatarMoeda } from "@/lib/formatacao";

const COLUNAS = [
  {
    titulo: "Clube",
    conteudo: (clube) => (
      <span className="flex items-center gap-3">
        <Sigla sigla={clube.acronym} />
        <span className="font-medium text-slate-900">{clube.name}</span>
      </span>
    ),
  },
  { titulo: "Sigla", conteudo: (clube) => <Selo tom="contorno">{clube.acronym}</Selo> },
  { titulo: "Caixa", alinhar: "direita", conteudo: (clube) => formatarMoeda(clube.cash) },
  { titulo: "Valor do elenco", alinhar: "direita", conteudo: (clube) => formatarMoeda(clube.squad_value) },
  { titulo: "Patrimônio", alinhar: "direita", conteudo: (clube) => <span className="font-semibold text-slate-900">{formatarMoeda(clube.net_worth)}</span> },
  {
    titulo: "Ações",
    alinhar: "direita",
    conteudo: (clube) => (
      <Link href={`/clubes/${clube.id}`} className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-primaria">
        Ver clube <ChevronRight className="size-4" aria-hidden />
      </Link>
    ),
  },
];

export function TabelaClubes({ clubes, carregando, erro, tentarDeNovo, aoNovo }) {
  return (
    <Tabela
      colunas={COLUNAS}
      itens={clubes}
      carregando={carregando}
      erro={erro}
      tentarDeNovo={tentarDeNovo}
      tituloDoErro="Não foi possível carregar os clubes"
      vazia={{
        icone: ShieldHalf,
        titulo: "Nenhum clube cadastrado",
        texto: "Crie o primeiro clube com nome e sigla. Ele começa com 300,00 em caixa e sem jogadores.",
        acao: { rotulo: "Novo clube", icone: Plus, aoClicar: aoNovo },
      }}
    />
  );
}
