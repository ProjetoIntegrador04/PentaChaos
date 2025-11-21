package com.sge.sge_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.response.UserResponse;
import com.sge.sge_app.repository.UserRepository;

import org.modelmapper.ModelMapper;

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
}
