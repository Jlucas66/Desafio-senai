import { Selo } from "@/components/ui/Selo";
import { rotuloDaCondicao } from "@/lib/dominio";

const TOM_DA_CONDICAO = { APTO: "verde", MAL_CONDICIONADO: "amarelo", DOENTE: "vermelho" };

export function SeloDeCondicao({ condicao }) {
  return (
    <Selo tom={TOM_DA_CONDICAO[condicao]} ponto>
      {rotuloDaCondicao(condicao)}
    </Selo>
  );
}
