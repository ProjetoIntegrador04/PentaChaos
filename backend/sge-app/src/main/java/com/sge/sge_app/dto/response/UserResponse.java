package com.sge.sge_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

import com.sge.sge_app.domain.model.Role;

/**
 * DTO de resposta com dados do usuário (sem senha)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private Set<Role> roles;
}
