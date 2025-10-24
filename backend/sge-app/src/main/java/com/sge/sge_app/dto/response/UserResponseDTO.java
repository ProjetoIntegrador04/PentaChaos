package com.sge.sge_app.dto.response;

import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // <-- usar LocalDateTime
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private Set<String> roles;

    // Ajuste o tipo para LocalDateTime para casar com a entidade
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponseDTO from(User u) {
        if (u == null) return null;

        Set<String> roleNames = (u.getRoles() == null)
                ? new LinkedHashSet<>()
                : u.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

        return UserResponseDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .enabled(u.isEnabled())
                .roles(roleNames)
                .createdAt(u.getCreatedAt()) // agora tipos batem
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
