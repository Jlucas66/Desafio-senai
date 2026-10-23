"use client";

import { Info, ShieldHalf, Swords } from "lucide-react";

import { AlertaDeErro } from "@/components/ui/AlertaDeErro";
import { Botao } from "@/components/ui/Botao";
import { Campo, Selecao } from "@/components/ui/Campo";
import { Modal } from "@/components/ui/Modal";
import { useAcao } from "@/hooks/useAcao";
import { useFormulario } from "@/hooks/useFormulario";
import { obrigatorio } from "@/lib/validacao";
import { jogarPartida } from "@/services/liga";

const REGRAS = {
  home_club_id: [obrigatorio("Escolha o mandante.")],
  away_club_id: [obrigatorio("Escolha o visitante.")],
};

export function FormularioPartida({ clubes, aoFechar, aoJogar }) {
  const { valores, erros, alterar, validarTudo } = useFormulario({ home_club_id: "", away_club_id: "" }, REGRAS);
  const { executar, enviando, erro } = useAcao(jogarPartida, aoJogar);
  const opcoes = clubes.map((clube) => ({ valor: clube.id, rotulo: `${clube.name} (${clube.acronym})` }));

  function enviar(evento) {
    evento.preventDefault();
    if (validarTudo()) {
      executar({ home_club_id: Number(valores.home_club_id), away_club_id: Number(valores.away_club_id) });
    }
  }

  return (
    <Modal
      titulo="Nova partida"
      descricao="Escolha o mandante e o visitante. O placar sai dos atributos dos titulares, sem sorteio."
      aoFechar={aoFechar}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="submit" form="formulario-partida" carregando={enviando}>
            {!enviando && <Swords className="size-4" />} Jogar partida
          </Botao>
        </>
      }
    >
      <form id="formulario-partida" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <AlertaDeErro erro={erro} titulo="Não foi possível jogar a partida" />
        <Campo id="partida-mandante" rotulo="Mandante" erro={erros.home_club_id} dica="Faz os 3 primeiros ataques.">
          <Selecao
            id="partida-mandante"
            icone={ShieldHalf}
            erro={erros.home_club_id}
            vazia="Escolha o mandante"
            opcoes={opcoes}
            value={valores.home_club_id}
            onChange={(evento) => alterar("home_club_id", evento.target.value)}
          />
        </Campo>
        <Campo id="partida-visitante" rotulo="Visitante" erro={erros.away_club_id} dica="Precisa ser um clube diferente do mandante.">
          <Selecao
            id="partida-visitante"
            icone={ShieldHalf}
            erro={erros.away_club_id}
            vazia="Escolha o visitante"
            opcoes={opcoes}
            value={valores.away_club_id}
            onChange={(evento) => alterar("away_club_id", evento.target.value)}
          />
        </Campo>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Info className="size-4" aria-hidden /> Como sai o placar
          </p>
          <p>
            Cada time faz 3 ataques. Pela ordem do elenco, os jogadores de linha vão do 1º (o mais recuado) ao 4º (o mais avançado): o 4º enfrenta o goleiro, o 3º
            enfrenta o 1º e o 2º enfrenta o 2º do adversário. O atacante usa finalização (ATA), passe (MEI) ou drible (ZAG e LAT), e quem defende usa defesa. É gol
            só quando o ataque é maior; mal condicionado joga com 15% a menos.
          </p>
          <p className="mt-2">Os dois clubes precisam ter os 5 titulares escalados. A partida não mexe no caixa.</p>
        </div>
      </form>
    </Modal>
  );
}
