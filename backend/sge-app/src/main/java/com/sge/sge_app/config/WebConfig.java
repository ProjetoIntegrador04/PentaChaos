package com.sge.sge_app.config; // Esta linha é crucial!

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todas as rotas da sua API
                .allowedOrigins("https://develop.d3aawq3k9qng9z.amplifyapp.com") // Sua origem frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP que seu frontend usará
                .allowedHeaders("*") // Permite todos os cabeçalhos (Authorization, Content-Type, etc.)
                .allowCredentials(true) // Importante se você usa credenciais como cookies ou cabeçalhos de autenticação
                .maxAge(3600); // Tempo em segundos que a resposta preflight pode ser armazenada em cache
    }
}