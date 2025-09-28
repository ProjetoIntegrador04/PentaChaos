package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

@Entity // Marca a classe como uma entidade JPA
@Table(name = "roles") // Nome da tabela no banco de dados
public class Role extends BaseEntity implements GrantedAuthority {

  @Column(name = "name", nullable = false, unique = true)
  private String name; // Nome do papel (ex: "ROLE_ADMIN", "ROLE_USER")

  // Construtor padrão (necessário para JPA)
  public Role() {
  }

  public Role(String name) {
    this.name = name;
  }

  // Getter e Setter
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  // Implementação da interface GrantedAuthority
  @Override
  public String getAuthority() {
    return name;
  }

  @Override
  public String toString() {
    return "Role{" +
        "name='" + name + '\'' +
        ", id=" + getId() +
        '}';
  }
}