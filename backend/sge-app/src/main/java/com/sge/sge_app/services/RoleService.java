package com.sge.sge_app.services;

import com.sge.sge_app.domain.model.Role;

import java.util.Optional;

public interface RoleService {
  Optional<Role> findByName(String name);

  Role createRole(String name); // Método para criar um novo papel, se necessário
  // Outros métodos como findAll, delete, etc.
}
