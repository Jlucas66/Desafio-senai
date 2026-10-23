"use client";

import { Check, HandCoins, Shirt, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { SeloDeCondicao } from "@/components/jogadores/SeloDeCondicao";
import { Avatar } from "@/components/ui/Avatar";
import { Botao } from "@/components/ui/Botao";
import { Cartao } from "@/components/ui/Cartao";
import { Selo } from "@/components/ui/Selo";
import { Tabela } from "@/components/ui/Tabela";
import { tomDoPercentualDeMulta } from "@/lib/cores";
import { formatarData, formatarHora, formatarInteiro, formatarMoeda } from "@/lib/formatacao";

export function AbaElenco({ clube, carregando, erro, tentarDeNovo, aoVender }) {
  const roteador = useRouter();

  const colunas = [
    {
      titulo: "Jogador",
      conteudo: (jogador) => (
        <span className="flex items-center gap-3">
          <Avatar nome={jogador.name} />
          <span className="font-medium text-slate-900">{jogador.name}</span>
        </span>
      ),
    },
    { titulo: "Posição", conteudo: (jogador) => <Selo tom="contorno">{jogador.position}</Selo> },
    { titulo: "Overall", alinhar: "direita", conteudo: (jogador) => <span className="font-semibold text-slate-900">{jogador.overall}</span> },
    { titulo: "Condição", conteudo: (jogador) => <SeloDeCondicao condicao={jogador.condition} /> },
    { titulo: "Valor de mercado", alinhar: "direita", conteudo: (jogador) => <span className="font-semibold text-slate-900">{formatarMoeda(jogador.market_value)}</span> },
    { titulo: "Valor de compra", alinhar: "direita", conteudo: (jogador) => <span className="text-slate-500">{formatarMoeda(jogador.contract.purchase_value)}</span> },
    {
      titulo: "Fim da fidelidade",
      conteudo: (jogador) => (
        <span>
          <span className="block text-slate-900">{formatarData(jogador.contract.loyalty_until)}</span>
          <span className="block text-xs text-slate-500">{formatarHora(jogador.contract.loyalty_until)}</span>
        </span>
      ),
    },
    { titulo: "Dias restantes", alinhar: "direita", conteudo: (jogador) => <span className="text-slate-900">{formatarInteiro(jogador.contract.remaining_days)}</span> },
    {
      titulo: "% de multa",
      conteudo: (jogador) => (
        <Selo tom={tomDoPercentualDeMulta(jogador.contract.penalty_rate)} icone={jogador.contract.penalty_rate === 0 ? Check : undefined}>
          {jogador.contract.penalty_rate}%
        </Selo>
      ),
    },
    {
      titulo: "Ações",
      alinhar: "direita",
      conteudo: (jogador) => (
        <Botao variante="secundario" onClick={() => aoVender(jogador)}>
          <HandCoins className="size-4" /> Vender
        </Botao>
      ),
    },
  ];

  return (
    <Cartao titulo="Elenco" descricao="Ordem por posição (GOL, ZAG, LAT, MEI, ATA), depois pelo nome. Contrato calculado para uma venda agora.">
      <Tabela
        colunas={colunas}
        itens={clube?.players ?? []}
        carregando={carregando}
        erro={erro}
        tentarDeNovo={tentarDeNovo}
        tituloDoErro="Não foi possível carregar o elenco"
        vazia={{
          icone: Shirt,
          titulo: "Nenhum jogador no elenco",
          texto: "Compre jogadores livres para montar o elenco. O limite é de 12 jogadores, e o custo de cada compra não pode passar de 50% do caixa.",
          acao: { rotulo: "Ver jogadores livres", icone: Users, aoClicar: () => roteador.push(`/jogadores?aba=livres&clube=${clube?.id}`) },
        }}
      />
    </Cartao>
  );
}
