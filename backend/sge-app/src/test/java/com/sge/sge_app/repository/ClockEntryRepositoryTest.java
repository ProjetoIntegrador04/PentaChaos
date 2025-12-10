package com.sge.sge_app.repository;

import com.sge.sge_app.models.ClockEntry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ClockEntry Repository Integration Tests")
class ClockEntryRepositoryTest {

    @Autowired
    private ClockEntryRepository clockEntryRepository;

    private ClockEntry sampleEntry;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        sampleEntry = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now)
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .ip("192.168.1.1")
                .build();
    }

    @Test
    @DisplayName("Deve salvar e recuperar ClockEntry")
    void deveSalvarERecuperarClockEntry() {
        // Given - sampleEntry já criado no setUp

        // When
        ClockEntry savedEntry = clockEntryRepository.save(sampleEntry);

        // Then
        assertNotNull(savedEntry.getId());
        assertEquals(1L, savedEntry.getUserId());
        assertEquals("ENTRY", savedEntry.getTipo());
        assertNotNull(savedEntry.getCreatedAt());
    }

    @Test
    @DisplayName("Deve encontrar ClockEntries por userId")
    void deveEncontrarPorUserId() {
        // Given
        ClockEntry entry1 = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now)
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry entry2 = ClockEntry.builder()
                .userId(1L)
                .tipo("EXIT")
                .timestamp(now.plusHours(8))
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry entry3 = ClockEntry.builder()
                .userId(2L) // Usuário diferente
                .tipo("ENTRY")
                .timestamp(now)
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device456")
                .build();

        clockEntryRepository.save(entry1);
        clockEntryRepository.save(entry2);
        clockEntryRepository.save(entry3);

        // When
        List<ClockEntry> entriesUsuario1 = clockEntryRepository.findByUserId(1L);
        List<ClockEntry> entriesUsuario2 = clockEntryRepository.findByUserId(2L);

        // Then
        assertEquals(2, entriesUsuario1.size());
        assertEquals(1, entriesUsuario2.size());
        
        assertTrue(entriesUsuario1.stream().allMatch(e -> e.getUserId().equals(1L)));
        assertTrue(entriesUsuario2.stream().allMatch(e -> e.getUserId().equals(2L)));
    }

    @Test
    @DisplayName("Deve encontrar último ClockEntry por userId e tipo")
    void deveEncontrarUltimoPorUserIdETipo() {
        // Given
        ClockEntry entryAntigo = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now.minusHours(2))
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry entryRecente = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now)
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        clockEntryRepository.save(entryAntigo);
        clockEntryRepository.save(entryRecente);

        // When
        Optional<ClockEntry> ultimoEntry = clockEntryRepository
                .findTopByUserIdAndTipoOrderByCreatedAtDesc(1L, "ENTRY");

        // Then
        assertTrue(ultimoEntry.isPresent());
        assertEquals(entryRecente.getTimestamp(), ultimoEntry.get().getTimestamp());
    }

    @Test
    @DisplayName("Deve encontrar ClockEntries por período")
    void deveEncontrarPorPeriodo() {
        // Given
        LocalDateTime inicioDia = now.toLocalDate().atStartOfDay();
        LocalDateTime fimDia = inicioDia.plusDays(1);

        ClockEntry entryHoje = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now)
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry entryOntem = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now.minusDays(1))
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        clockEntryRepository.save(entryHoje);
        clockEntryRepository.save(entryOntem);

        // When
        List<ClockEntry> entriesHoje = clockEntryRepository
                .findByUserIdAndTimestampBetween(1L, inicioDia, fimDia);

        // Then
        assertEquals(1, entriesHoje.size());
        assertEquals(entryHoje.getTimestamp(), entriesHoje.get(0).getTimestamp());
    }

    @Test
    @DisplayName("Deve retornar lista vazia para usuário sem registros")
    void deveRetornarListaVaziaParaUsuarioSemRegistros() {
        // When
        List<ClockEntry> entries = clockEntryRepository.findByUserId(999L);

        // Then
        assertTrue(entries.isEmpty());
    }

    @Test
    @DisplayName("Deve retornar Optional vazio para tipo não encontrado")
    void deveRetornarOptionalVazioParaTipoNaoEncontrado() {
        // Given
        clockEntryRepository.save(sampleEntry); // Salva um ENTRY

        // When
        Optional<ClockEntry> exitEntry = clockEntryRepository
                .findTopByUserIdAndTipoOrderByCreatedAtDesc(1L, "EXIT");

        // Then
        assertTrue(exitEntry.isEmpty());
    }

    @Test
    @DisplayName("Deve validar campos obrigatórios")
    void deveValidarCamposObrigatorios() {
        // Given - ClockEntry com campos nulos
        ClockEntry entryInvalida = ClockEntry.builder()
                .userId(null) // Deveria ser obrigatório
                .tipo(null) // Deveria ser obrigatório
                .build();

        // When & Then - Deve lançar exceção ao tentar salvar
        assertThrows(Exception.class, () -> {
            clockEntryRepository.save(entryInvalida);
            clockEntryRepository.flush(); // Força a validação
        });
    }

    @Test
    @DisplayName("Deve ordenar por createdAt descendente")
    void deveOrdenarPorCreatedAtDescendente() {
        // Given
        ClockEntry entry1 = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now.minusHours(2))
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry entry2 = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(now.minusHours(1))
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .build();

        ClockEntry saved1 = clockEntryRepository.save(entry1);
        // Pequeno delay para garantir createdAt diferentes
        try { Thread.sleep(100); } catch (InterruptedException e) {}
        ClockEntry saved2 = clockEntryRepository.save(entry2);

        // When
        Optional<ClockEntry> ultimoEntry = clockEntryRepository
                .findTopByUserIdAndTipoOrderByCreatedAtDesc(1L, "ENTRY");

        // Then
        assertTrue(ultimoEntry.isPresent());
        assertEquals(saved2.getId(), ultimoEntry.get().getId());
    }
