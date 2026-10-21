"use client";

import { useState } from "react";

import { validar } from "@/lib/validacao";

export function useFormulario(valoresIniciais, regras) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});

  function alterar(campo, valor) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: null }));
  }

  function validarTudo() {
    const encontrados = validar(valores, regras);
    setErros(encontrados);
    return Object.keys(encontrados).length === 0;
  }

  return { valores, erros, alterar, validarTudo };
}
