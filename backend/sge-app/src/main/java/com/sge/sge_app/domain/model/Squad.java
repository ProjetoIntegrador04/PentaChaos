package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidade Squad - Representa um squad/equipe de trabalho
 * Um squad pode ter vários membros (usuários)
 */
@Entity
@Table(name = "squads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Squad extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name; // Nome do squad (ex: "Squad LSD", "Squad CASE")

    @Column(length = 500)
    private String description; // Descrição do squad

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "squad_members",
        joinColumns = @JoinColumn(name = "squad_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> members = new HashSet<>(); // Membros do squad

    /**
     * Adiciona um membro ao squad
     */
    public void addMember(User user) {
        this.members.add(user);
    }

    /**
     * Remove um membro do squad
     */
    public void removeMember(User user) {
        this.members.remove(user);
    }

    /**
     * Retorna a quantidade de membros no squad
     */
    public int getMemberCount() {
        return this.members != null ? this.members.size() : 0;
    }
}
