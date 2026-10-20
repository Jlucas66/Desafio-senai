package br.com.passe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    private static final String DESCRICAO = "API da liga: jogadores, clubes, compra e venda com contrato de "
            + "fidelidade, histórico de transações, escalação, partidas e classificação. "
            + "Datas no horário de Brasília (-03:00) e valores em moedas com 2 casas.";

    @Bean
    public OpenAPI documentacaoDaApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Passe: mercado de jogadores")
                        .version("1.0")
                        .description(DESCRICAO));
    }
}
