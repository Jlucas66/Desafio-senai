import { Volleyball } from "lucide-react";
import { Fragment } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Selo } from "@/components/ui/Selo";
import { rotuloDoAtributo } from "@/lib/dominio";
import { plural } from "@/lib/formatacao";

import { papeisDoDuelo } from "./rotulos";

function Participante({ participante, papel, clube }) {
  return (
    <span className="flex items-center gap-3">
      <Avatar nome={participante.player_name} />
      <span>
        <span className="block font-medium text-slate-900">{participante.player_name}</span>
        <span className="block text-xs text-slate-500">
          {papel === "Goleiro" ? "Goleiro" : `${participante.position}, ${papel}`} · {clube}
        </span>
      </span>
    </span>
  );
}

export function TabelaDuelos({ partida, siglaDoClube }) {
  const nomeDoClube = (id) => (id === partida.home.club_id ? partida.home.club_name : partida.away.club_name);
  const grupos = [
    { lado: partida.home, papel: "mandante", duelos: partida.duels.filter((duelo) => duelo.attacking_club_id === partida.home.club_id) },
    { lado: partida.away, papel: "visitante", duelos: partida.duels.filter((duelo) => duelo.attacking_club_id === partida.away.club_id) },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            {["Duelo", "Atacante", "Ataque", "Defensor", "Defesa", "Resultado"].map((titulo) => (
              <th key={titulo} scope="col" className="px-4 py-2.5 text-left font-normal">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <Fragment key={grupo.papel}>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <td colSpan={5} className="px-4 py-2 text-xs font-medium text-slate-900">
                  <span className="mr-2 rounded border border-slate-200 bg-white px-1.5 py-0.5">{siglaDoClube(grupo.lado.club_id)}</span>
                  Ataques do {grupo.lado.club_name} ({grupo.papel})
                </td>
                <td className="px-4 py-2 text-right text-xs text-slate-600">{plural(grupo.lado.goals, "gol", "gols")}</td>
              </tr>
              {grupo.duelos.map((duelo) => {
                const papeis = papeisDoDuelo(duelo.order);
                return (
                  <tr key={duelo.order} className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      <span className="rounded border border-slate-200 px-1.5 py-0.5 text-xs">{duelo.order}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Participante participante={duelo.attacker} papel={papeis.atacante} clube={nomeDoClube(duelo.attacking_club_id)} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {rotuloDoAtributo(duelo.attacker.attribute)} <span className="font-semibold text-slate-900">{duelo.attacker.value}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Participante
                        participante={duelo.defender}
                        papel={papeis.defensor}
                        clube={nomeDoClube(duelo.attacking_club_id === partida.home.club_id ? partida.away.club_id : partida.home.club_id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {rotuloDoAtributo(duelo.defender.attribute)} <span className="font-semibold text-slate-900">{duelo.defender.value}</span>
                    </td>
                    <td className="px-4 py-3">
                      {duelo.goal ? (
                        <Selo tom="verde" icone={Volleyball}>
                          Gol
                        </Selo>
                      ) : (
                        <Selo tom="contorno">Sem gol</Selo>
                      )}
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
