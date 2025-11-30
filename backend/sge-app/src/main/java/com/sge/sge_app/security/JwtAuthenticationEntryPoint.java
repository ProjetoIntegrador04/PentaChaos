package com.sge.sge_app.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {

        logger.warn("Acesso não autorizado: {}", authException.getMessage());

        String message = "E-mail/usuário ou senha inválidos.";

        // CASO 1: Conta desativada
        if (authException.getCause() instanceof DisabledException
                || authException instanceof DisabledException) {
            message = "Sem permissão (conta inativa).";
        }

        // CASO 2: Token ausente ou inválido
        if (authException.getMessage() != null &&
                authException.getMessage().toLowerCase().contains("jwt")) {
            message = "Token inválido ou expirado.";
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        // Corpo da resposta em JSON
        new ObjectMapper().writeValue(
                response.getOutputStream(),
                Map.of("error", message)
        );
    }
}
