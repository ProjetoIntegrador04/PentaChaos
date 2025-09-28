package com.sge.sge_app.repository;

import com.sge.sge_app.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Método para buscar um Role pelo nome
    // Spring Data JPA gerará a query automaticamente: SELECT r FROM Role r WHERE r.name = ?
    Optional<Role> findByName(String name);
}