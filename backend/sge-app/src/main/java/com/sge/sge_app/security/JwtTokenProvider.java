package com.sge.sge_app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

import com.sge.sge_app.domain.model.User; // Importe sua entidade User

@Component // Marca a classe como um componente Spring
public class JwtTokenProvider {

  private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

  // Injeta as propriedades do arquivo .env (via application.properties)
  @Value("${jwt.secret-key}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private long jwtExpirationInMs; // Tempo de expiração do Access Token em milissegundos

  @Value("${jwt.refresh-expiration}")
  private long jwtRefreshExpirationInMs; // Tempo de expiração do Refresh Token em milissegundos

  private Key key; // Chave secreta para assinar e verificar tokens

  // Método que é executado após a injeção das dependências
  @PostConstruct
  public void init() {
    // Tenta decodificar Base64; se falhar, usa bytes da string diretamente.
    byte[] keyBytes;
    try {
      keyBytes = Decoders.BASE64.decode(jwtSecret);
    } catch (IllegalArgumentException e) {
      // Não é Base64, usar como UTF-8 literal
      keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    }

    // HS512 exige chave >= 512 bits (64 bytes)
    if (keyBytes.length < 64) {
      logger.warn("jwt.secret-key is too small ({} bytes). Generating a secure ephemeral key for HS512. Set a Base64-encoded 512-bit key in properties to avoid this.", keyBytes.length);
      this.key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
      return;
    }

    this.key = Keys.hmacShaKeyFor(keyBytes);
  }

  /**
   * Gera um Access Token para a autenticação bem-sucedida.
   * 
   * @param authentication Objeto Authentication contendo os detalhes do usuário
   *                       autenticado.
   * @return Access Token JWT.
   */
  public String generateAccessToken(Authentication authentication) {
    User userPrincipal = (User) authentication.getPrincipal(); // Obtém a entidade User

    // Coleta os papéis do usuário
    String roles = userPrincipal.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(","));

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

    return Jwts.builder()
        .setSubject(userPrincipal.getUsername()) // O "subject" do token é o username
        .claim("roles", roles) // Adiciona os papéis como uma claim personalizada
        .setIssuedAt(new Date()) // Data de emissão
        .setExpiration(expiryDate) // Data de expiração
        .signWith(key, SignatureAlgorithm.HS512) // Assina o token com a chave e algoritmo HS512
        .compact(); // Constrói e compacta o token em uma string JWT
  }

  /**
   * Gera um Refresh Token.
   * 
   * @param authentication Objeto Authentication contendo os detalhes do usuário
   *                       autenticado.
   * @return Refresh Token JWT.
   */
  public String generateRefreshToken(Authentication authentication) {
    User userPrincipal = (User) authentication.getPrincipal();

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationInMs);

    return Jwts.builder()
        .setSubject(userPrincipal.getUsername())
        .setIssuedAt(new Date())
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS512)
        .compact();
  }

  /**
   * Obtém o username do token JWT.
   * 
   * @param token Token JWT.
   * @return Username do usuário.
   */
  public String getUsernameFromToken(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();

    return claims.getSubject();
  }

  /**
   * Valida um token JWT.
   * 
   * @param authToken Token JWT a ser validado.
   * @return true se o token é válido, false caso contrário.
   */
  public boolean validateToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
      return true;
    } catch (io.jsonwebtoken.security.SignatureException ex) {
      logger.error("Assinatura JWT inválida: {}", ex.getMessage());
    } catch (MalformedJwtException ex) {
      logger.error("Token JWT inválido: {}", ex.getMessage());
    } catch (ExpiredJwtException ex) {
      logger.error("Token JWT expirado: {}", ex.getMessage());
    } catch (UnsupportedJwtException ex) {
      logger.error("Token JWT não suportado: {}", ex.getMessage());
    } catch (IllegalArgumentException ex) {
      logger.error("JWT claims string vazia: {}", ex.getMessage());
    }
    return false;
  }

  /**
   * Obtém o tempo de expiração do Access Token.
   * 
   * @return Tempo de expiração em milissegundos.
   */
  public long getJwtExpirationInMs() {
    return jwtExpirationInMs;
  }
}
