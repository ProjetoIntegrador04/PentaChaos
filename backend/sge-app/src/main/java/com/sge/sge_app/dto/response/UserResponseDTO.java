package com.sge.sge_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
  private Long id;
  private String username;
  private String email;
  private boolean enabled;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private Set<String> roles; // Retorna apenas os nomes dos papéis
}
