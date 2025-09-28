package com.sge.sge_app.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRequestDTO {

  @NotBlank(message = "O nome de usuário ou e-mail não pode estar em branco.")
  private String usernameOrEmail; // Pode ser username ou email para login

  @NotBlank(message = "A senha não pode estar em branco.")
  private String password;
}