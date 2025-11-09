package com.sge.sge_app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

  private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

  @Value("${jwt.secret-key}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private long jwtExpirationInMs;          // expiração do Access Token (ms)

  @Value("${jwt.refresh-expiration}")
  private long jwtRefreshExpirationInMs;   // expiração do Refresh Token (ms)

  private Key key;

  @PostConstruct
  public void init() {
    byte[] keyBytes;
    try {
      keyBytes = Decoders.BASE64.decode(jwtSecret);
    } catch (IllegalArgumentException e) {
      keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    }

    if (keyBytes.length < 64) {
      logger.warn("jwt.secret-key parece curto ({} bytes). Considere usar uma chave Base64 de >=64 bytes.", keyBytes.length);
    }
    this.key = Keys.hmacShaKeyFor(keyBytes);
  }

  /** Gera o Access Token para a autenticação bem-sucedida. */
  public String generateAccessToken(Authentication authentication) {
    UserDetails principal = (UserDetails) authentication.getPrincipal(); // <-- UserDetails (não a entidade)

    String roles = authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(","));

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

    return Jwts.builder()
        .setSubject(principal.getUsername()) // subject = username
        .claim("roles", roles)               // opcional: roles no claim
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  /** Gera o Refresh Token. */
  public String generateRefreshToken(Authentication authentication) {
    UserDetails principal = (UserDetails) authentication.getPrincipal(); // <-- UserDetails

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationInMs);

    return Jwts.builder()
        .setSubject(principal.getUsername())
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  /** Extrai o username (subject) do token. */
  public String getUsernameFromToken(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  /** Valida um token JWT. */
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

  /** Expiração do Access Token (ms). */
  public long getJwtExpirationInMs() {
    return jwtExpirationInMs;
  }
}
