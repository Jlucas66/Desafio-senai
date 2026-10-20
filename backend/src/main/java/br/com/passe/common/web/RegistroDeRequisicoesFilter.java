package br.com.passe.common.web;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Uma linha de log por requisição, com método, caminho, status e duração; a data e a hora vêm do padrão do Logback.
 */
@Component
public class RegistroDeRequisicoesFilter extends OncePerRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(RegistroDeRequisicoesFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest requisicao, HttpServletResponse resposta, FilterChain cadeia)
            throws ServletException, IOException {
        long inicio = System.nanoTime();
        try {
            cadeia.doFilter(requisicao, resposta);
        } finally {
            long duracaoEmMs = (System.nanoTime() - inicio) / 1_000_000;
            LOG.info(
                    "{} {} {} ({} ms)",
                    requisicao.getMethod(),
                    caminhoCompleto(requisicao),
                    resposta.getStatus(),
                    duracaoEmMs);
        }
    }

    private static String caminhoCompleto(HttpServletRequest requisicao) {
        String consulta = requisicao.getQueryString();
        return consulta == null ? requisicao.getRequestURI() : requisicao.getRequestURI() + "?" + consulta;
    }
}
