package br.com.passe.controller;

public final class Rotas {

    /**
     * V8: id da URL só com dígitos, positivo e sem zeros à esquerda; outro formato não casa com nenhuma rota (404).
     */
    public static final String ID = "/{id:[1-9][0-9]*}";

    private Rotas() {}
}
