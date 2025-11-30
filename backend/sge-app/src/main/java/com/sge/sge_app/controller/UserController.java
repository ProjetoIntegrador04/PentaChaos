package com.sge.sge_app.controller;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.response.UserResponse;
import com.sge.sge_app.repository.UserRepository;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller para gerenciar operações de usuários
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Retorna os dados do usuário autenticado atual
     * Endpoint: GET /api/v1/users/me
     * 
     * Lógica:
     * 1. Pega o username do token JWT (via Spring Security)
     * 2. Busca o usuário no banco
     * 3. Retorna os dados (sem a senha)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // Pega o usuário autenticado do contexto do Spring Security
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Busca o usuário no banco
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Converte para DTO (sem senha)
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao buscar dados do usuário: " + e.getMessage());
        }
    }

    /**
     * Atualiza os dados do usuário autenticado
     * Endpoint: PUT /api/v1/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UserResponse updateData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Atualiza apenas campos permitidos (não atualiza senha aqui)
            if (updateData.getEmail() != null) {
                user.setEmail(updateData.getEmail());
            }
            // Adicione outros campos conforme necessário

            userRepository.save(user);

            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    /**
     * Lista todos os usuários
     * Endpoint: GET /api/v1/users
     * Requer autenticação e role ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            
            // Converte para DTO (sem senhas)
            List<UserResponse> userResponses = users.stream()
                    .map(user -> modelMapper.map(user, UserResponse.class))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao buscar usuários: " + e.getMessage());
        }
    }

    /**
     * Busca um usuário específico por ID
     * Endpoint: GET /api/v1/users/{id}
     * Requer role ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao buscar usuário: " + e.getMessage());
        }
    }

    /**
     * Atualiza um usuário específico (ADMIN)
     * Endpoint: PUT /api/v1/users/{id}
     * Requer role ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserResponse updateData) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Atualiza campos permitidos
            if (updateData.getEmail() != null) {
                user.setEmail(updateData.getEmail());
            }
            if (updateData.getUsername() != null) {
                user.setUsername(updateData.getUsername());
            }

            userRepository.save(user);

            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    /**
     * Ativa/Desativa um usuário
     * Endpoint: PATCH /api/v1/users/{id}/status
     * Requer role ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Inverte o status
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);

            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao alterar status do usuário: " + e.getMessage());
        }
=======
import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.CreateInternDTO;
import com.sge.sge_app.dto.InternUserDTO;
import com.sge.sge_app.services.impl.UserServiceImpl;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    // ============================================================
    // LISTAR TODOS
    // ============================================================
    @GetMapping
    public List<InternUserDTO> listAll() {
        return userService.findAllRaw().stream()
                .map(u -> new InternUserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getEmailPessoal(),
                        u.getRa(),
                        u.getSquad(),
                        u.isEnabled(),
                        u.getRoles()
                                .stream()
                                .map(Role::getName)
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // ============================================================
    // CRIAR ESTAGIÁRIO
    // ============================================================
    @PostMapping("/create-intern")
    public ResponseEntity<InternUserDTO> createIntern(@RequestBody CreateInternDTO dto) {

        User created = userService.createIntern(dto);

        return ResponseEntity.ok(
                new InternUserDTO(
                        created.getId(),
                        created.getUsername(),
                        created.getEmail(),
                        created.getEmailPessoal(),
                        created.getRa(),
                        created.getSquad(),
                        created.isEnabled(),
                        created.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toList())
                )
        );
    }

    // ============================================================
    // EDITAR USUÁRIO
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<InternUserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        User updated = userService.updateUser(id, payload);

        return ResponseEntity.ok(
                new InternUserDTO(
                        updated.getId(),
                        updated.getUsername(),
                        updated.getEmail(),
                        updated.getEmailPessoal(),
                        updated.getRa(),
                        updated.getSquad(),
                        updated.isEnabled(),
                        updated.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                )
        );
    }

    // ============================================================
    // ALTERAR STATUS (ATIVO / INATIVO)
    // ============================================================
    @PatchMapping("/{id}/status")
public ResponseEntity<Map<String, Object>> updateStatus(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
) {
    if (!body.containsKey("enabled"))
        throw new RuntimeException("Campo 'enabled' é obrigatório.");

    boolean enabled = Boolean.parseBoolean(body.get("enabled").toString());

    User updated = userService.updateStatus(id, enabled);

    return ResponseEntity.ok(Map.of("enabled", updated.isEnabled()));
}

    // ============================================================
    // EXCLUIR USUÁRIO
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
>>>>>>> feature/functions-integrations
    }
}
