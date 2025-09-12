package projeto_integrador.authservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Requisição para o cadastro de um novo usuário")
public class RegisterRequest {
    @NotBlank(message = "O nome é obrigatório")
    @Schema(description = "Nome do usuário", example = "João Silva")
    private String name;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Schema(description = "E-mail do usuário (único)", example = "joao.silva@example.com")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    @Schema(description = "Senha do usuário", example = "MinhaSenha123")
    private String password;

    @NotBlank(message = "A confirmação da senha é obrigatória")
    @Schema(description = "Confirmação da senha do usuário", example = "MinhaSenha123")
    private String confirmPassword;
}
