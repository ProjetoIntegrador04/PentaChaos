package com.sge.sge_app.services.impl;

import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.CreateInternDTO;
import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;
import com.sge.sge_app.repository.RoleRepository;
import com.sge.sge_app.repository.UserRepository;
import com.sge.sge_app.services.UserService;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    // ============================================================
    // /auth/register
    // ============================================================
    @Override
    public UserResponseDTO registerNewUser(UserRegisterRequestDTO request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> { throw new RuntimeException("Email já cadastrado."); });

        userRepository.findByUsername(request.getUsername())
                .ifPresent(u -> { throw new RuntimeException("Username já cadastrado."); });

        // Determinar o role: ROLE_ADMIN se isAdmin=true, senão ROLE_USER
        String roleName = Boolean.TRUE.equals(request.getIsAdmin()) ? "ROLE_ADMIN" : "ROLE_USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role inválida: " + roleName));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setEnabled(true);

        user.setFullName(request.getFullName());
        user.setRa(request.getRa());
        user.setSquad(request.getSquad());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRoles(Set.of(role));

        return UserResponseDTO.from(userRepository.save(user));
    }

    // ============================================================
    // MÉTODOS DA INTERFACE
    // ============================================================
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Override
    public UserResponseDTO findUserResponseById(@NonNull Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return UserResponseDTO.from(u);
    }

    @Override
    public List<UserResponseDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findAllRaw() {
        return userRepository.findAll();
    }

    // ============================================================
    // CRIAR ESTAGIÁRIO — /users/create-intern
    // ============================================================
    public User createIntern(CreateInternDTO dto) {

        Role internRole = roleRepository.findByName("ROLE_INTERN")
                .orElseThrow(() -> new RuntimeException("Role ROLE_INTERN não encontrada"));

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setEmailPessoal(dto.getEmailPessoal());
        user.setRa(dto.getRa());
        user.setSquad(dto.getSquad());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setEnabled(true);
        user.setRoles(Set.of(internRole));

        return userRepository.save(user);
    }

    // ============================================================
    // EDITAR USUÁRIO — /users/{id}
    // ============================================================
    public User updateUser(@NonNull Long id, Map<String, Object> payload) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // EMAIL
        if (payload.containsKey("email")) {
            String email = (String) payload.get("email");
            userRepository.findByEmail(email).ifPresent(u -> {
                if (!u.getId().equals(id))
                    throw new RuntimeException("Email já está em uso.");
            });
            user.setEmail(email);
        }

        // USERNAME
        if (payload.containsKey("username")) {
            String username = (String) payload.get("username");
            userRepository.findByUsername(username).ifPresent(u -> {
                if (!u.getId().equals(id))
                    throw new RuntimeException("Username já está em uso.");
            });
            user.setUsername(username);
        }

        if (payload.containsKey("ra")) user.setRa((String) payload.get("ra"));
        if (payload.containsKey("squad")) user.setSquad((String) payload.get("squad"));
        if (payload.containsKey("emailPessoal")) user.setEmailPessoal((String) payload.get("emailPessoal"));

        // SENHA (somente se enviada)
        if (payload.containsKey("password")) {
            String pwd = (String) payload.get("password");
            if (pwd != null && !pwd.trim().isEmpty()) {
                user.setPassword(encoder.encode(pwd));
            }
        }

        @SuppressWarnings("null")
        User result = userRepository.save(user);
        return result;
    }

    // ============================================================
    // ALTERAR STATUS — /users/{id}/status
    // ============================================================
    public User updateStatus(@NonNull Long id, boolean enabled) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setEnabled(enabled);

        return userRepository.save(user);
    }

    // ============================================================
    // EXCLUIR — /users/{id}
    // ============================================================
    public void deleteUser(@NonNull Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        userRepository.deleteById(id);
    }
}

