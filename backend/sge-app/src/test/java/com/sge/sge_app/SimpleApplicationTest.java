package com.sge.sge_app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class SimpleApplicationTest {

    @Test
    void contextLoads() {
        // Teste básico para verificar se o contexto do Spring carrega
    }
}