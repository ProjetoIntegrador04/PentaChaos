package com.sge.sge_app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
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

    // ex: "ROLE_INTERN" / "ROLE_COORDINATOR" / "ROLE_ADMIN"
    private String role;

    // --- OPCIONAIS (para compatibilizar com /users/create-intern) ---
    private String ra;
    private String squad;
    private String emailPessoal;
}
