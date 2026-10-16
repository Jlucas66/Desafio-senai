package br.com.passe.config;

import java.time.Clock;
import java.time.ZoneOffset;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    private static final ZoneOffset BRASILIA = ZoneOffset.ofHours(-3);

    @Bean
    public Clock clock() {
        return Clock.system(BRASILIA);
    }
}