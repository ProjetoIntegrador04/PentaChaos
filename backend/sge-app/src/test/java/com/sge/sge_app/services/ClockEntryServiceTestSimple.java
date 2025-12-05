package com.sge.sge_app.services;

import com.sge.sge_app.dto.request.ClockEntryRequest;
import com.sge.sge_app.dto.response.ClockEntryResponse;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.exception.BusinessException;
import com.sge.sge_app.models.ClockEntry;
import com.sge.sge_app.repository.ClockEntryRepository;
import com.sge.sge_app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClockEntryServiceTestSimple {

    @Mock
    private ClockEntryRepository clockEntryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ClockEntryService clockEntryService;

    private User testUser;
    private ClockEntryRequest validRequest;
    private ClockEntry savedClockEntry;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .build();
        testUser.setId(1L);

        validRequest = ClockEntryRequest.builder()
                .tipo("ENTRY")
                .timestamp(LocalDateTime.now())
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .ip("192.168.1.1")
                .build();

        savedClockEntry = ClockEntry.builder()
                .id(1L)
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(LocalDateTime.now())
                .latitude(-23.550520f)
                .longitude(-46.633308f)
                .precisao(10.5f)
                .fonte("WEB")
                .deviceId("device123")
                .ip("192.168.1.1")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void deveRegistrarPontoEntradaComSucesso() {
        // Given
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.save(any(ClockEntry.class)))
                .thenReturn(savedClockEntry);

        // When
        ClockEntryResponse response = clockEntryService.registrarPonto(validRequest, authentication);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ENTRY", response.getTipo());
        verify(clockEntryRepository).save(any(ClockEntry.class));
    }

    @Test
    void deveFalharUsuarioNaoEncontrado() {
        // Given
        when(authentication.getName()).thenReturn("nonexistent");
        when(userRepository.findByUsernameOrEmail("nonexistent", "nonexistent"))
                .thenReturn(Optional.empty());

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Usuário não encontrado", exception.getMessage());
        verify(clockEntryRepository, never()).save(any());
    }

    @Test
    void deveBuscarPontoPorIdComSucesso() {
        // Given
        when(clockEntryRepository.findById(1L))
                .thenReturn(Optional.of(savedClockEntry));

        // When
        ClockEntryResponse response = clockEntryService.buscarPontoPorId(1L);

        // Then
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ENTRY", response.getTipo());
    }
}