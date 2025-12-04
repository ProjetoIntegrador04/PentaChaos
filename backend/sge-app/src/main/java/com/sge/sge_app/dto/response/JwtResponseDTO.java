package com.sge.sge_app.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponseDTO {
  private String accessToken;
  private String refreshToken;
  @Builder.Default
  private String tokenType = "Bearer";
  private Long expiresIn;
  private java.util.List<String> roles;
}
