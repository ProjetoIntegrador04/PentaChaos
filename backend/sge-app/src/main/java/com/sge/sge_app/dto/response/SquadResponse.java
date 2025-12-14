package com.sge.sge_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO de resposta para Squad
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SquadResponse {
    private Long id;
    private String name;
    private String description;
    private int memberCount;
    private Set<UserBasicInfo> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * DTO simplificado de usuário para não expor todos os dados
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBasicInfo {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private String ra;
        private String squadRole; // Função na Squad (P.O, Desenvolvedor, etc)
        private Set<RoleInfo> roles;
    }

    /**
     * DTO simplificado de role
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleInfo {
        private Long id;
        private String name;
    }
}
