package com.sge.sge_app.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

  @Override
  public void commence(HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse,
      AuthenticationException e) throws IOException, ServletException {
    logger.error("Respondendo com erro não autorizado. Mensagem - {}", e.getMessage());
    // Retorna um erro HTTP 401 (Unauthorized) e escreve a mensagem no corpo da
    // resposta
    httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
        "Você não está autorizado a acessar este recurso.");
  }
}