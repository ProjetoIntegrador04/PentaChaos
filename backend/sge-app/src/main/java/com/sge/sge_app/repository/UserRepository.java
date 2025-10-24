package com.sge.sge_app.repository;

import com.sge.sge_app.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Busca por username OU email usando um único parâmetro
    @Query("select u from User u where u.username = :q or u.email = :q")
    Optional<User> findByUsernameOrEmail(@Param("q") String usernameOrEmail);
}
