package projeto_integrador.repositories;

import projeto_integrador.models.ClockEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClockEntryRepository extends JpaRepository<ClockEntry, Long> {
    List<ClockEntry> findByUserId(Long userId);
}