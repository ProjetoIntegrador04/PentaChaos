package com.sge.sge_app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponseDTO {
  private String accessToken;
  private String refreshToken;
  private String tokenType = "Bearer";
  private Long expiresIn; // Tempo de expiração do access token em milissegundos
}
