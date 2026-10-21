import { Botao } from "./Botao";
import { Modal } from "./Modal";

export function Confirmacao({ titulo, mensagem, rotuloDaAcao, variante = "primario", enviando, aoConfirmar, aoCancelar }) {
  return (
    <Modal titulo={titulo} aoFechar={aoCancelar}>
      <p className="text-sm text-slate-600">{mensagem}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Botao variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao variante={variante} onClick={aoConfirmar} carregando={enviando}>
          {rotuloDaAcao}
        </Botao>
      </div>
    </Modal>
  );
}
