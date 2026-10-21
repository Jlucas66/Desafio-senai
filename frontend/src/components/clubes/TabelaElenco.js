import { SeloDeCondicao } from "@/components/jogadores/SeloDeCondicao";
import { Tabela } from "@/components/ui/Tabela";
import { formatarDataHora, formatarMoeda } from "@/lib/formatacao";

const COLUNAS = [
  { titulo: "Nome", conteudo: (jogador) => <span className="font-medium text-slate-900">{jogador.name}</span> },
  { titulo: "Posição", conteudo: (jogador) => jogador.position },
  { titulo: "Overall", alinhar: "direita", conteudo: (jogador) => jogador.overall },
  { titulo: "Condição", conteudo: (jogador) => <SeloDeCondicao condicao={jogador.condition} /> },
  { titulo: "Valor de mercado", alinhar: "direita", conteudo: (jogador) => formatarMoeda(jogador.market_value) },
  { titulo: "Valor de compra", alinhar: "direita", conteudo: (jogador) => formatarMoeda(jogador.contract.purchase_value) },
  { titulo: "Fim da fidelidade", conteudo: (jogador) => formatarDataHora(jogador.contract.loyalty_until) },
  { titulo: "Dias restantes", alinhar: "direita", conteudo: (jogador) => jogador.contract.remaining_days },
  { titulo: "% de multa", alinhar: "direita", conteudo: (jogador) => `${jogador.contract.penalty_rate}%` },
];

export function TabelaElenco({ jogadores, carregando, erro }) {
  return (
    <Tabela colunas={COLUNAS} itens={jogadores} carregando={carregando} erro={erro} mensagemVazia="O elenco ainda está vazio." />
  );
}
