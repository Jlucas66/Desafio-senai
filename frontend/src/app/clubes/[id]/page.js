"use client";

import { ArrowLeft, Building2, CircleDollarSign, ClipboardList, History, SearchX, Shirt, ShoppingCart, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

import { AbaElenco } from "@/components/clubes/AbaElenco";
import { AbaEscalacao } from "@/components/clubes/AbaEscalacao";
import { AbaHistorico } from "@/components/clubes/AbaHistorico";
import { ConfirmacaoVenda } from "@/components/mercado/ConfirmacaoVenda";
import { ResultadoVenda } from "@/components/mercado/ResultadoVenda";
import { AbasSublinhadas } from "@/components/ui/Abas";
import { Sigla } from "@/components/ui/Avatar";
import { CartaoIndicador } from "@/components/ui/CartaoIndicador";
import { EstadoDaLista } from "@/components/ui/EstadoDaLista";
import { useCarregamento } from "@/hooks/useCarregamento";
import { MAXIMO_DO_ELENCO } from "@/lib/dominio";
import { formatarMoeda } from "@/lib/formatacao";
import { buscarClube, buscarEscalacao, listarTransacoes } from "@/services/clubes";

const ABAS = ["elenco", "escalacao", "historico"];

function PaginaDoClube() {
  const { id } = useParams();
  const roteador = useRouter();
  const parametrosDaUrl = useSearchParams();
  const aba = ABAS.includes(parametrosDaUrl.get("aba")) ? parametrosDaUrl.get("aba") : "elenco";
  const [janela, setJanela] = useState(null);

  const buscarDados = useCallback(async () => {
    const [clube, escalacao, historico] = await Promise.all([buscarClube(id), buscarEscalacao(id), listarTransacoes(id)]);
    return { clube, escalacao, historico };
  }, [id]);
  const dados = useCarregamento(buscarDados);
  const clube = dados.dados?.clube;
  const escalacao = dados.dados?.escalacao;
  const transacoes = dados.dados?.historico.data;

  // Jogadores que aparecem no histórico do clube, para o filtro por jogador (o nome é o gravado na transação).
  const jogadoresDoHistorico = useMemo(() => {
    const porId = new Map();
    for (const transacao of transacoes ?? []) {
      if (!porId.has(transacao.player_id)) {
        porId.set(transacao.player_id, { id: transacao.player_id, nome: transacao.player_name });
      }
    }
    return [...porId.values()];
  }, [transacoes]);

  function mudarAba(novaAba) {
    roteador.replace(`/clubes/${id}?aba=${novaAba}`, { scroll: false });
  }

  if (dados.erro?.status === 404) {
    return (
      <div className="rounded-2xl border border-slate-200">
        <EstadoDaLista
          icone={SearchX}
          titulo="Clube não encontrado"
          texto="Clube não encontrado. O endereço pode estar errado ou o clube não existe."
          acao={{ rotulo: "Voltar para clubes", icone: ArrowLeft, aoClicar: () => roteador.push("/clubes") }}
        />
      </div>
    );
  }

  const ehTitular = (jogador) => Boolean(escalacao?.players.some((titular) => titular.id === jogador.id));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Sigla sigla={clube?.acronym ?? "···"} grande />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{clube?.name ?? "Clube"}</h1>
            {clube && (
              <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-md border border-slate-200 px-1.5 py-0.5 font-medium text-slate-900">Sigla {clube.acronym}</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 font-medium text-slate-900">
                  <Shirt className="size-3" aria-hidden /> {clube.players.length} de {MAXIMO_DO_ELENCO} jogadores
                </span>
              </div>
            )}
          </div>
        </div>
        <Link
          href={`/jogadores?aba=livres&clube=${id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primaria px-4 py-2 text-sm font-medium text-white transition hover:bg-primaria-escura"
        >
          <ShoppingCart className="size-4" /> Comprar jogadores
        </Link>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoIndicador rotulo="Caixa" valor={clube ? formatarMoeda(clube.cash) : "–"} unidade="moedas" legenda="Só muda por compras e vendas" icone={Wallet} />
        <CartaoIndicador rotulo="Valor do elenco" valor={clube ? formatarMoeda(clube.squad_value) : "–"} unidade="moedas" legenda="Soma dos valores de mercado" icone={CircleDollarSign} />
        <CartaoIndicador rotulo="Patrimônio" valor={clube ? formatarMoeda(clube.net_worth) : "–"} unidade="moedas" legenda="Caixa + valor do elenco" icone={Building2} />
        <CartaoIndicador rotulo="Elenco" valor={clube ? `${clube.players.length} de ${MAXIMO_DO_ELENCO}` : "–"} legenda={`Limite de ${MAXIMO_DO_ELENCO} jogadores`} icone={Shirt} />
      </div>

      <div className="mb-5">
        <AbasSublinhadas
          selecionada={aba}
          aoSelecionar={mudarAba}
          abas={[
            { valor: "elenco", rotulo: "Elenco", icone: Shirt, contador: clube?.players.length },
            { valor: "escalacao", rotulo: "Escalação", icone: ClipboardList },
            { valor: "historico", rotulo: "Histórico", icone: History, contador: transacoes?.length },
          ]}
        />
      </div>

      {aba === "elenco" && (
        <AbaElenco clube={clube} carregando={dados.carregando} erro={dados.erro} tentarDeNovo={dados.tentarDeNovo} aoVender={(jogador) => setJanela({ tipo: "venda", jogador })} />
      )}
      {aba === "escalacao" && <AbaEscalacao clube={clube} escalacao={escalacao} />}
      {aba === "historico" && <AbaHistorico clubeId={id} jogadoresDoHistorico={jogadoresDoHistorico} />}

      {janela?.tipo === "venda" && (
        <ConfirmacaoVenda
          jogador={janela.jogador}
          nomeDoClube={clube.name}
          ehTitular={ehTitular(janela.jogador)}
          aoFechar={() => setJanela(null)}
          aoVender={(venda) => setJanela({ tipo: "vendido", venda })}
        />
      )}
      {janela?.tipo === "vendido" && (
        <ResultadoVenda
          venda={janela.venda}
          nomeDoClube={clube.name}
          aoFechar={() => setJanela(null)}
          aoVerHistorico={() => {
            setJanela(null);
            mudarAba("historico");
          }}
        />
      )}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <PaginaDoClube />
    </Suspense>
  );
}
