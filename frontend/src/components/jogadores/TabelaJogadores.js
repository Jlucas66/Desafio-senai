import { Ellipsis, Eye, HeartPulse, Pencil, Plus, ShoppingCart, Trash2, Users } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Botao } from "@/components/ui/Botao";
import { ItemDoMenu, Menu, SeparadorDoMenu, TituloDoMenu } from "@/components/ui/Menu";
import { Selo } from "@/components/ui/Selo";
import { Tabela } from "@/components/ui/Tabela";
import { corDaAgilidade } from "@/lib/cores";
import { rotuloDaPosicao } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";

import { SeloDeCondicao } from "./SeloDeCondicao";

function BarraDeAgilidade({ agilidade }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-6 text-right">{agilidade}</span>
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-slate-100" aria-hidden>
        <span className={`block h-full rounded-full ${corDaAgilidade(agilidade)}`} style={{ width: `${agilidade}%` }} />
      </span>
    </span>
  );
}

export function TabelaJogadores({ jogadores, carregando, erro, tentarDeNovo, clubes, semFiltros, aoNovo, acoes, destaque }) {
  const clubePorId = new Map(clubes.map((clube) => [clube.id, clube]));

  const colunas = [
    {
      titulo: "Jogador",
      conteudo: (jogador) => (
        <span className="flex items-center gap-3">
          <Avatar nome={jogador.name} />
          <span>
            <span className="block font-medium whitespace-nowrap text-slate-900">{jogador.name}</span>
            <span className="block text-xs whitespace-nowrap text-slate-500">{rotuloDaPosicao(jogador.position)}</span>
          </span>
        </span>
      ),
    },
    { titulo: "Posição", conteudo: (jogador) => <Selo tom="contorno">{jogador.position}</Selo> },
    { titulo: "Overall", alinhar: "direita", conteudo: (jogador) => <span className="font-semibold text-slate-900">{jogador.overall}</span> },
    { titulo: "Agilidade", conteudo: (jogador) => <BarraDeAgilidade agilidade={jogador.agility} /> },
    { titulo: "Idade", alinhar: "direita", conteudo: (jogador) => jogador.age },
    { titulo: "Condição", conteudo: (jogador) => <SeloDeCondicao condicao={jogador.condition} /> },
    { titulo: "Valor base", alinhar: "direita", conteudo: (jogador) => <span className="text-slate-500">{formatarMoeda(jogador.base_value)}</span> },
    {
      titulo: "Valor de mercado",
      alinhar: "direita",
      conteudo: (jogador) => <span className="font-semibold text-slate-900">{formatarMoeda(jogador.market_value)}</span>,
    },
    {
      titulo: "Clube",
      conteudo: (jogador) => {
        const clube = clubePorId.get(jogador.club_id);
        if (jogador.club_id === null) {
          return <Selo>Livre</Selo>;
        }
        return (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-medium text-slate-700">{clube?.acronym}</span>
            <Link href={`/clubes/${jogador.club_id}`} className="text-slate-900 underline underline-offset-2">
              {clube?.name ?? `Clube ${jogador.club_id}`}
            </Link>
          </span>
        );
      },
    },
    {
      titulo: "",
      alinhar: "direita",
      conteudo: (jogador) => {
        const livre = jogador.club_id === null;
        return (
          <span className="flex items-center justify-end gap-2">
            {livre && (
              <Botao variante="secundario" className="px-2.5" onClick={() => acoes.comprar(jogador)}>
                <ShoppingCart className="size-4" /> Comprar
              </Botao>
            )}
            <Menu icone={Ellipsis} seta={false} alinhamento="direita" largura="w-56" rotuloAcessivel={`Ações de ${jogador.name}`}>
              <TituloDoMenu>{jogador.name}</TituloDoMenu>
              <ItemDoMenu icone={Eye} onClick={() => acoes.detalhar(jogador)}>
                Ver detalhes
              </ItemDoMenu>
              <ItemDoMenu icone={Pencil} onClick={() => acoes.editar(jogador)}>
                Editar
              </ItemDoMenu>
              <ItemDoMenu icone={HeartPulse} onClick={() => acoes.alterarCondicao(jogador)}>
                Alterar condição
              </ItemDoMenu>
              {livre && (
                <>
                  <SeparadorDoMenu />
                  <ItemDoMenu icone={ShoppingCart} onClick={() => acoes.comprar(jogador)}>
                    Comprar
                  </ItemDoMenu>
                </>
              )}
              <SeparadorDoMenu />
              <ItemDoMenu
                icone={Trash2}
                perigo
                desabilitado={!livre}
                onClick={() => acoes.excluir(jogador)}
                dica={livre ? "Disponível porque o jogador está livre." : "Só jogador livre pode ser excluído."}
              >
                Excluir
              </ItemDoMenu>
            </Menu>
          </span>
        );
      },
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      itens={jogadores}
      carregando={carregando}
      erro={erro}
      tentarDeNovo={tentarDeNovo}
      tituloDoErro="Não foi possível carregar os jogadores"
      destacarLinha={(jogador) => jogador.id === destaque}
      vazia={
        semFiltros
          ? {
              icone: Users,
              titulo: "Nenhum jogador cadastrado",
              texto: "Com o banco recém-criado, a lista começa vazia.",
              acao: { rotulo: "Novo jogador", icone: Plus, aoClicar: aoNovo },
            }
          : { icone: Users, titulo: "Nenhum jogador encontrado", texto: "Nenhum jogador atende aos filtros escolhidos." }
      }
    />
  );
}
