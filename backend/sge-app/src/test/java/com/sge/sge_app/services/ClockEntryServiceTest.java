package com.sge.sge_app.services;

import com.sge.sge_app.dto.request.ClockEntryRequest;
import com.sge.sge_app.dto.response.ClockEntryResponse;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.exception.BusinessException;
import com.sge.sge_app.models.ClockEntry;
import com.sge.sge_app.repository.ClockEntryRepository;
import com.sge.sge_app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ClockEntry Service Tests")
class ClockEntryServiceTest {

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
        testUser.setId(1L); // ID vem da BaseEntity, não do Builder

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
    @DisplayName("Deve registrar ponto de entrada com sucesso")
    void deveRegistrarPontoEntradaComSucesso() {
        // Given
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.findByUserIdAndTimestampBetween(eq(1L), any(), any()))
                .thenReturn(List.of());
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
    @DisplayName("Deve falhar ao registrar ponto com usuário não encontrado")
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
    @DisplayName("Deve falhar ao registrar tipo inválido")
    void deveFalharTipoInvalido() {
        // Given
        validRequest.setTipo("INVALID_TYPE");
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertTrue(exception.getMessage().contains("Tipo de ponto inválido"));
    }

    @Test
    @DisplayName("Deve falhar ao registrar fonte inválida")
    void deveFalharFonteInvalida() {
        // Given
        validRequest.setFonte("INVALID_SOURCE");
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertTrue(exception.getMessage().contains("Fonte inválida"));
    }

    @Test
    @DisplayName("Deve falhar ao registrar ponto no futuro")
    void deveFalharPontoNoFuturo() {
        // Given
        validRequest.setTimestamp(LocalDateTime.now().plusHours(1));
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Não é possível registrar ponto no futuro", exception.getMessage());
    }

    @Test
    @DisplayName("Deve falhar ao registrar EXIT sem ENTRY anterior")
    void deveFalharExitSemEntry() {
        // Given
        validRequest.setTipo("EXIT");
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.findTopByUserIdAndTipoOrderByCreatedAtDesc(1L, "ENTRY"))
                .thenReturn(Optional.empty());

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Não é possível registrar EXIT sem um ENTRY anterior", exception.getMessage());
    }

    @Test
    @DisplayName("Deve falhar ao registrar segundo ENTRY sem EXIT")
    void deveFalharSegundoEntrySemExit() {
        // Given
        ClockEntry entryExistente = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(LocalDateTime.now().minusHours(1))
                .build();

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.findByUserIdAndTimestampBetween(eq(1L), any(), any()))
                .thenReturn(List.of(entryExistente)); // 1 ENTRY, 0 EXIT

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Já existe um ENTRY sem EXIT registrado hoje", exception.getMessage());
    }

    @Test
    @DisplayName("Deve falhar com coordenadas inválidas - latitude")
    void deveFalharLatitudeInvalida() {
        // Given
        validRequest.setLatitude(95.0f); // Latitude inválida (> 90)
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Latitude deve estar entre -90 e 90 graus", exception.getMessage());
    }

    @Test
    @DisplayName("Deve falhar com coordenadas inválidas - longitude")
    void deveFalharLongitudeInvalida() {
        // Given
        validRequest.setLongitude(185.0f); // Longitude inválida (> 180)
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Longitude deve estar entre -180 e 180 graus", exception.getMessage());
    }

    @Test
    @DisplayName("Deve falhar ao iniciar almoço sem ENTRY")
    void deveFalharLunchStartSemEntry() {
        // Given
        validRequest.setTipo("LUNCH_START");
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.findByUserIdAndTimestampBetween(eq(1L), any(), any()))
                .thenReturn(List.of()); // Nenhum ponto registrado hoje

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
                () -> clockEntryService.registrarPonto(validRequest, authentication));

        assertEquals("Não é possível iniciar almoço sem registrar entrada", exception.getMessage());
    }

    @Test
    @DisplayName("Deve registrar EXIT com sucesso após ENTRY")
    void deveRegistrarExitComSucessoAposEntry() {
        // Given
        validRequest.setTipo("EXIT");
        ClockEntry entryAnterior = ClockEntry.builder()
                .userId(1L)
                .tipo("ENTRY")
                .timestamp(LocalDateTime.now().minusHours(8))
                .build();

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(testUser));
        when(clockEntryRepository.findTopByUserIdAndTipoOrderByCreatedAtDesc(1L, "ENTRY"))
                .thenReturn(Optional.of(entryAnterior));
        when(clockEntryRepository.save(any(ClockEntry.class)))
                .thenReturn(savedClockEntry);

        // When
        ClockEntryResponse response = clockEntryService.registrarPonto(validRequest, authentication);

        // Then
        assertNotNull(response);
        verify(clockEntryRepository).save(any(ClockEntry.class));
    }

    @Test
    @DisplayName("Deve buscar ponto por ID com sucesso")
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

    @Test
    @DisplayName("Deve falhar ao buscar ponto inexistente")
    void deveFalharBuscarPontoInexistente() {
        // Given
        when(clockEntryRepository.findById(999L))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(Exception.class, // ResourceNotFoundException
                () -> clockEntryService.buscarPontoPorId(999L));
    }
}