package com.sge.sge_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration // Marca a classe como uma fonte de definições de beans
@EnableJpaAuditing // Habilita o suporte a JPA Auditing
public class AuditingConfig {
    // Nada mais é necessário aqui. A simples anotação @EnableJpaAuditing
    // já ativa o AuditingEntityListener para preencher os campos.
}