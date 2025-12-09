package com.sge.sge_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.response.UserResponse;
import com.sge.sge_app.repository.UserRepository;

import lombok.NonNull;
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

            @SuppressWarnings("null")
            User savedUser = userRepository.save(user);

            UserResponse userResponse = modelMapper.map(savedUser, UserResponse.class);
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
    public ResponseEntity<?> getUserById(@PathVariable @NonNull Long id) {
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
    public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody UserResponse updateData) {
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
            if (updateData.getFullName() != null) {
                user.setFullName(updateData.getFullName());
            }
            if (updateData.getRa() != null) {
                user.setRa(updateData.getRa());
            }
            if (updateData.getPhoneNumber() != null) {
                user.setPhoneNumber(updateData.getPhoneNumber());
            }
            if (updateData.getSquad() != null) {
                user.setSquad(updateData.getSquad());
            }
            // Atualiza o campo enabled (ativo/inativo)
            user.setEnabled(updateData.isEnabled());

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
    public ResponseEntity<?> toggleUserStatus(@PathVariable @NonNull Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Inverte o status
            user.setEnabled(!user.isEnabled());
            @SuppressWarnings("null")
            User savedUser = userRepository.save(user);

            UserResponse userResponse = modelMapper.map(savedUser, UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao alterar status do usuário: " + e.getMessage());
        }
    }
}

