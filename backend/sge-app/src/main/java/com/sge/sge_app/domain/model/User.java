package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity // Marca a classe como uma entidade JPA
@Table(name = "users") // Nome da tabela no banco de dados
public class User extends BaseEntity implements UserDetails {

  @Column(name = "username", nullable = false, unique = true)
  private String username;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "enabled", nullable = false)
  private boolean enabled = true; // Indica se a conta está ativa

  @Column(name = "account_locked", nullable = false)
  private boolean accountLocked = false; // Indica se a conta está bloqueada

  @Column(name = "credentials_expired", nullable = false)
  private boolean credentialsExpired = false; // Indica se as credenciais expiraram

  @Column(name = "account_expired", nullable = false)
  private boolean accountExpired = false; // Indica se a conta expirou

  @ManyToMany(fetch = FetchType.EAGER) // Relacionamento muitos-para-muitos com Role
  @JoinTable(name = "user_roles", // Tabela de junção
      joinColumns = @JoinColumn(name = "user_id"), // Coluna que referencia o User
      inverseJoinColumns = @JoinColumn(name = "role_id") // Coluna que referencia o Role
  )
  private Set<Role> roles = new HashSet<>(); // Conjunto de roles do usuário

  // Construtor padrão (necessário para JPA)
  public User() {
  }

  // Construtor com campos essenciais (pode ser útil para testes ou criação)
  public User(String username, String email, String password, Set<Role> roles) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  // --- Implementação da interface UserDetails ---

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    // Retorna a coleção de roles (GrantedAuthority) que o usuário possui
    return roles.stream().collect(Collectors.toSet());
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return !accountExpired;
  }

  @Override
  public boolean isAccountNonLocked() {
    return !accountLocked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return !credentialsExpired;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  // --- Getters e Setters específicos de User ---

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public void setAccountLocked(boolean accountLocked) {
    this.accountLocked = accountLocked;
  }

  public void setCredentialsExpired(boolean credentialsExpired) {
    this.credentialsExpired = credentialsExpired;
  }

  public void setAccountExpired(boolean accountExpired) {
    this.accountExpired = accountExpired;
  }
}