package com.sge.sge_app.repository;

import com.sge.sge_app.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Indica que esta interface é um componente de acesso a dados (DAO)
public interface UserRepository extends JpaRepository<User, Long> {

    // Método para buscar um User pelo username
    // Spring Data JPA gerará a query automaticamente: SELECT u FROM User u WHERE u.username = ?
    Optional<User> findByUsername(String username);

    // Método para buscar um User pelo email
    // Spring Data JPA gerará a query automaticamente: SELECT u FROM User u WHERE u.email = ?
    Optional<User> findByEmail(String email);

    // Método para verificar se um username já existe
    boolean existsByUsername(String username);

    // Método para verificar se um email já existe
    boolean existsByEmail(String email);

    // Método para buscar usuário por username ou email
    Optional<User> findByUsernameOrEmail(String username, String email);
}