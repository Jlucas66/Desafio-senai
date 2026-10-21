import { Botao } from "./Botao";

export function AcoesDoFormulario({ rotulo, enviando, aoCancelar }) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
        Cancelar
      </Botao>
      <Botao type="submit" carregando={enviando}>
        {rotulo}
      </Botao>
    </div>
  );
}
