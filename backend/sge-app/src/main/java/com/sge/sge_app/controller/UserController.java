package com.sge.sge_app.controller;

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
    }
}
