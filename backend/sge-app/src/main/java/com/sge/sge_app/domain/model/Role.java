package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "roles") // Define o nome da tabela no banco de dados
@Getter
@Setter
@NoArgsConstructor // Construtor sem argumentos (necessário pelo JPA)
@AllArgsConstructor // Construtor com todos os argumentos
@Builder // Permite construir objetos de forma fluente (Role.builder()...build())
public class Role extends BaseEntity implements GrantedAuthority {

    @Column(nullable = false, unique = true) // Nome do papel, não pode ser nulo e deve ser único
    private String name; // Ex: "ROLE_ADMIN", "ROLE_USER"

    @Override
    public String getAuthority() {
        // Retorna o nome do papel para o Spring Security
        return name;
    }

    // Adicione equals e hashCode se Lombok não estiver gerando com @EqualsAndHashCode(callSuper = true)
    // Para entidades JPA, é importante que equals e hashCode usem o ID.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false; // Se estender BaseEntity e BaseEntity tiver equals/hashCode
        Role role = (Role) o;
        return id != null && id.equals(role.id); // Comparar pelo ID para entidades persistentes
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : super.hashCode(); // Usar ID para hashCode
    }
}