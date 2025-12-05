package com.sge.sge_app.repository;

import com.sge.sge_app.domain.model.Squad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Repository para Squad
 */
@Repository
public interface SquadRepository extends JpaRepository<Squad, Long> {
    
    /**
     * Busca um squad pelo nome
     */
    Optional<Squad> findByName(String name);

    /**
     * Busca squads que contenham o nome especificado (case-insensitive)
     */
    List<Squad> findByNameContainingIgnoreCase(String name);

    /**
     * Verifica se já existe um squad com o nome especificado
     */
    boolean existsByName(String name);

    /**
     * Busca squads de um usuário específico
     */
    @Query("SELECT s FROM Squad s JOIN s.members m WHERE m.id = :userId")
    List<Squad> findSquadsByUserId(@Param("userId") Long userId);

    /**
     * Conta quantos membros um squad tem
     */
    @Query("SELECT COUNT(m) FROM Squad s JOIN s.members m WHERE s.id = :squadId")
    Long countMembersBySquadId(@Param("squadId") Long squadId);
}
