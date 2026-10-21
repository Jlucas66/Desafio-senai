import { HeartPulse, Pencil, Trash2 } from "lucide-react";

import { SeloDeCondicao } from "@/components/jogadores/SeloDeCondicao";
import { Selo } from "@/components/ui/Selo";
import { Tabela } from "@/components/ui/Tabela";
import { formatarMoeda } from "@/lib/formatacao";

function BotaoDeAcao({ titulo, onClick, children }) {
  return (
    <button type="button" title={titulo} aria-label={titulo} onClick={onClick} className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
      {children}
    </button>
  );
}

export function TabelaJogadores({ jogadores, carregando, erro, nomesDosClubes, aoEditar, aoAlterarCondicao, aoExcluir }) {
  const colunas = [
    { titulo: "Nome", conteudo: (jogador) => <span className="font-medium text-slate-900">{jogador.name}</span> },
    { titulo: "Posição", conteudo: (jogador) => jogador.position },
    { titulo: "Overall", alinhar: "direita", conteudo: (jogador) => jogador.overall },
    { titulo: "Agilidade", alinhar: "direita", conteudo: (jogador) => jogador.agility },
    { titulo: "Idade", alinhar: "direita", conteudo: (jogador) => jogador.age },
    {
      titulo: "Condição",
      conteudo: (jogador) => <SeloDeCondicao condicao={jogador.condition} />,
    },
    { titulo: "Valor base", alinhar: "direita", conteudo: (jogador) => formatarMoeda(jogador.base_value) },
    {
      titulo: "Valor de mercado",
      alinhar: "direita",
      conteudo: (jogador) => <span className="font-medium text-slate-900">{formatarMoeda(jogador.market_value)}</span>,
    },
    {
      titulo: "Clube",
      conteudo: (jogador) =>
        jogador.club_id === null ? <Selo tom="azul">Livre</Selo> : nomesDosClubes.get(jogador.club_id) ?? `Clube ${jogador.club_id}`,
    },
    {
      titulo: "Ações",
      alinhar: "direita",
      conteudo: (jogador) => (
        <div className="flex justify-end gap-1">
          <BotaoDeAcao titulo="Editar" onClick={() => aoEditar(jogador)}>
            <Pencil className="size-4" />
          </BotaoDeAcao>
          <BotaoDeAcao titulo="Alterar condição" onClick={() => aoAlterarCondicao(jogador)}>
            <HeartPulse className="size-4" />
          </BotaoDeAcao>
          {jogador.club_id === null && (
            <BotaoDeAcao titulo="Excluir" onClick={() => aoExcluir(jogador)}>
              <Trash2 className="size-4" />
            </BotaoDeAcao>
          )}
        </div>
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      itens={jogadores}
      carregando={carregando}
      erro={erro}
      mensagemVazia="Nenhum jogador encontrado."
    />
  );
}
