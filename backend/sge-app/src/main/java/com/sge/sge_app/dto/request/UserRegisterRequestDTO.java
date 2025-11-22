package com.sge.sge_app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data // Inclui getters, setters, equals, hashCode, toString (Lombok)
@Builder // Permite construir o objeto de forma fluente (Lombok)
public class UserRegisterRequestDTO {

  @NotBlank(message = "O nome de usuário não pode estar em branco.")
  @Size(min = 3, max = 50, message = "O nome de usuário deve ter entre 3 e 50 caracteres.")
  private String username;

  @NotBlank(message = "O e-mail não pode estar em branco.")
  @Email(message = "O e-mail deve ser válido.")
  @Size(max = 100, message = "O e-mail não pode exceder 100 caracteres.")
  private String email;

  @NotBlank(message = "A senha não pode estar em branco.")
  @Size(min = 6, max = 100, message = "A senha deve ter pelo menos 6 caracteres.")
  private String password;

  // Campos opcionais adicionais
  private String fullName; // Nome completo
  private String ra; // Registro Acadêmico
  private String squad; // Squad/Equipe
  private String phoneNumber; // Telefone
  
  // Flag para indicar se o usuário deve ser criado como ADMIN
  // Apenas admins podem criar outros admins
  private Boolean isAdmin; // Se true, adiciona ROLE_ADMIN
}