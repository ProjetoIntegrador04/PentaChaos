package com.sge.sge_app.services;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponseDTO registerNewUser(UserRegisterRequestDTO request);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    // >>> adicionado para suportar /auth/me e login com username/email
    User findByUsernameOrEmail(String usernameOrEmail);

    UserResponseDTO findUserResponseById(Long id);

    List<UserResponseDTO> findAllUsers();
}
