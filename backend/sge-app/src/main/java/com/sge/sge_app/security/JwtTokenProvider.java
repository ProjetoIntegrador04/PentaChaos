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

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret-key}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs; // Access token expiration

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpirationInMs; // Refresh token expiration

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
            logger.warn(
                "jwt.secret-key parece curto ({} bytes). Recomenda-se usar uma chave Base64 >= 64 bytes.",
                keyBytes.length
            );
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // -------------------------
    //  ACCESS TOKEN COM ID NO SUB
    // -------------------------
    public String generateAccessToken(Authentication authentication) {

        com.sge.sge_app.domain.model.User user =
                (com.sge.sge_app.domain.model.User) authentication.getPrincipal();

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))   // <<< AGORA O SUB É O ID
                .claim("roles", roles)
                .claim("username", user.getUsername())
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // -------------------------
    //  REFRESH TOKEN COM ID NO SUB
    // -------------------------
    public String generateRefreshToken(Authentication authentication) {

        com.sge.sge_app.domain.model.User user =
                (com.sge.sge_app.domain.model.User) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationInMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))   // <<< ID COMO SUB TAMBÉM NO REFRESH
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrai subject (AGORA É O ID)
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // Validação padrão
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;

        } catch (io.jsonwebtoken.security.SignatureException ex) {
            logger.error("Assinatura JWT inválida: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Token JWT malformado: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Token JWT expirado: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Token JWT não suportado: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims vazias: {}", ex.getMessage());
        }

        return false;
    }

    public long getJwtExpirationInMs() {
        return jwtExpirationInMs;
    }
}
