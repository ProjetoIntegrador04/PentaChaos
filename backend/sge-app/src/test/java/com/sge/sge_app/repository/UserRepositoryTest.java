package com.sge.sge_app.repository;

import com.sge.sge_app.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("User Repository Integration Tests")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .build();
    }

    @Test
    @DisplayName("Deve salvar e recuperar User")
    void deveSalvarERecuperarUser() {
        // When
        User savedUser = userRepository.save(sampleUser);

        // Then
        assertNotNull(savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getCreatedAt());
    }

    @Test
    @DisplayName("Deve encontrar User por username")
    void deveEncontrarPorUsername() {
        // Given
        userRepository.save(sampleUser);

        // When
        Optional<User> foundUser = userRepository.findByUsername("testuser");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
        assertEquals("test@example.com", foundUser.get().getEmail());
    }

    @Test
    @DisplayName("Deve encontrar User por email")
    void deveEncontrarPorEmail() {
        // Given
        userRepository.save(sampleUser);

        // When
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
        assertEquals("test@example.com", foundUser.get().getEmail());
    }

    @Test
    @DisplayName("Deve encontrar User por username ou email")
    void deveEncontrarPorUsernameOuEmail() {
        // Given
        userRepository.save(sampleUser);

        // When - Buscar por username
        Optional<User> foundByUsername = userRepository.findByUsernameOrEmail("testuser", "testuser");
        
        // When - Buscar por email
        Optional<User> foundByEmail = userRepository.findByUsernameOrEmail("test@example.com", "test@example.com");

        // Then
        assertTrue(foundByUsername.isPresent());
        assertTrue(foundByEmail.isPresent());
        assertEquals("testuser", foundByUsername.get().getUsername());
        assertEquals("testuser", foundByEmail.get().getUsername());
    }

    @Test
    @DisplayName("Deve verificar se username existe")
    void deveVerificarSeUsernameExiste() {
        // Given
        userRepository.save(sampleUser);

        // When & Then
        assertTrue(userRepository.existsByUsername("testuser"));
        assertFalse(userRepository.existsByUsername("naoexiste"));
    }

    @Test
    @DisplayName("Deve verificar se email existe")
    void deveVerificarSeEmailExiste() {
        // Given
        userRepository.save(sampleUser);

        // When & Then
        assertTrue(userRepository.existsByEmail("test@example.com"));
        assertFalse(userRepository.existsByEmail("naoexiste@example.com"));
    }

    @Test
    @DisplayName("Deve retornar Optional vazio para username não encontrado")
    void deveRetornarOptionalVazioParaUsernameNaoEncontrado() {
        // When
        Optional<User> user = userRepository.findByUsername("naoexiste");

        // Then
        assertTrue(user.isEmpty());
    }

    @Test
    @DisplayName("Deve retornar Optional vazio para email não encontrado")
    void deveRetornarOptionalVazioParaEmailNaoEncontrado() {
        // When
        Optional<User> user = userRepository.findByEmail("naoexiste@example.com");

        // Then
        assertTrue(user.isEmpty());
    }

    @Test
    @DisplayName("Deve garantir unicidade do username")
    void deveGarantirUnicidadeDoUsername() {
        // Given
        userRepository.save(sampleUser);

        User userComMesmoUsername = User.builder()
                .username("testuser") // Mesmo username
                .email("outro@example.com")
                .password("outrasenha")
                .build();

        // When & Then - Deve lançar exceção por violação de constraint
        assertThrows(Exception.class, () -> {
            userRepository.save(userComMesmoUsername);
            userRepository.flush(); // Força a validação
        });
    }

    @Test
    @DisplayName("Deve garantir unicidade do email")
    void deveGarantirUnicidadeDoEmail() {
        // Given
        userRepository.save(sampleUser);

        User userComMesmoEmail = User.builder()
                .username("outrousuario")
                .email("test@example.com") // Mesmo email
                .password("outrasenha")
                .build();

        // When & Then - Deve lançar exceção por violação de constraint
        assertThrows(Exception.class, () -> {
            userRepository.save(userComMesmoEmail);
            userRepository.flush(); // Força a validação
        });
    }

    @Test
    @DisplayName("Deve ser case-sensitive para username")
    void deveSerCaseSensitiveParaUsername() {
        // Given
        userRepository.save(sampleUser);

        // When
        Optional<User> userLowerCase = userRepository.findByUsername("testuser");
        Optional<User> userUpperCase = userRepository.findByUsername("TESTUSER");

        // Then
        assertTrue(userLowerCase.isPresent());
        assertTrue(userUpperCase.isEmpty()); // Case-sensitive
    }

    @Test
    @DisplayName("Deve permitir múltiplos usuários com dados diferentes")
    void devePermitirMultiplosUsuariosComDadosDiferentes() {
        // Given
        User user1 = User.builder()
                .username("user1")
                .email("user1@example.com")
                .password("password1")
                .build();

        User user2 = User.builder()
                .username("user2")
                .email("user2@example.com")
                .password("password2")
                .build();

        // When
        User savedUser1 = userRepository.save(user1);
        User savedUser2 = userRepository.save(user2);

        // Then
        assertNotNull(savedUser1.getId());
        assertNotNull(savedUser2.getId());
        assertNotEquals(savedUser1.getId(), savedUser2.getId());
        assertEquals(2, userRepository.count());
    }
}