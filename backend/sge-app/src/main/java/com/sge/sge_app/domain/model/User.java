package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users") // Define o nome da tabela no banco de dados
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // ATENÇÃO: Armazenar senhas HASHED, nunca em texto puro!

    // Campos adicionais para o sistema
    private String fullName; // Nome completo
    private String ra; // Registro Acadêmico ou ID
    private String squad; // Squad/Equipe do usuário
    private String phoneNumber; // Telefone
    private String emailPessoal; // Email pessoal
    
    @Builder.Default
    private boolean enabled = true; // Indica se o usuário está ativo
    @Builder.Default
    private boolean accountLocked = false; // Indica se a conta do usuário está bloqueada
    @Builder.Default
    private boolean credentialsExpired = false; // Indica se as credenciais do usuário expiraram
    @Builder.Default
    private boolean accountExpired = false; // Indica se a conta do usuário expirou
    

    @ManyToMany(fetch = FetchType.EAGER) // Carrega os papéis junto com o usuário para facilitar as verificações de segurança
    @JoinTable(
        name = "user_roles", // Nome da tabela de junção
        joinColumns = @JoinColumn(name = "user_id"), // Coluna que referencia o ID do usuário
        inverseJoinColumns = @JoinColumn(name = "role_id") // Coluna que referencia o ID do papel
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>(); // Conjunto de papéis do usuário

    // Métodos da interface UserDetails:
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.accountExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !this.credentialsExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    // Adicione equals e hashCode para entidades JPA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id); // Comparar pelo ID
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : super.hashCode(); // Usar ID para hashCode
    }
}