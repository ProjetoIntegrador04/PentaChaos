package com.sge.sge_app.repository;

import com.sge.sge_app.models.ClockEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClockEntryRepository extends JpaRepository<ClockEntry, Long> {
    List<ClockEntry> findByUserId(Long userId);

    Optional<ClockEntry> findTopByUserIdAndTipoOrderByCreatedAtDesc(Long userId, String tipo);
}