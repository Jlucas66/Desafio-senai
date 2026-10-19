package br.com.passe.config;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.passe.common.datahora.DataHora;

@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        return Clock.system(DataHora.BRASILIA);
    }
}