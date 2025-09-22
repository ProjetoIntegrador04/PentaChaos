package projeto_integrador.authservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requisição para autenticação de usuário")
public class LoginRequest {
  @NotBlank(message = "O e-mail é obrigatório")
  @Email(message = "Formato de e-mail inválido")
  @Schema(description = "E-mail do usuário", example = "joao.silva@example.com")
  private String email;

  @NotBlank(message = "A senha é obrigatória")
  @Schema(description = "Senha do usuário", example = "MinhaSenha123")
  private String password;
}