package com.sge.sge_app.services;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Cadastro genérico (método original do projeto)
    UserResponseDTO registerNewUser(UserRegisterRequestDTO request);

    // Busca por username
    Optional<User> findByUsername(String username);

    // Busca por email
    Optional<User> findByEmail(String email);

    // Login pode ser username ou email
    User findByUsernameOrEmail(String usernameOrEmail);

    // Busca um usuário pelo ID retornando DTO
    UserResponseDTO findUserResponseById(Long id);

    // Retorna TODOS os usuários mas no formato UserResponseDTO (usado em auth/me)
    List<UserResponseDTO> findAllUsers();

    // ===============================================================
    // 🔵 NOVO
    // Usado pelo /users do frontend → precisa retornar o User REAL,
    // não um DTO simplificado, pois o frontend exige:
    // ra, squad, emailPessoal, enabled, roles, etc.
    // ===============================================================
    List<User> findAllRaw();
}
