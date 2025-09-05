// C:\Users\gabri\OneDrive\Área de Trabalho\PentaChaos\backend\P_I\frequency\src\main\java\projeto_integrador\service\ClockEntryService.java
package projeto_integrador.services; // Ajustado para o seu pacote base

import projeto_integrador.dto.ClockEntryRequest; // Ajustado para o seu pacote DTO
import projeto_integrador.dto.ClockEntryResponse; // Ajustado para o seu pacote DTO
import projeto_integrador.models.ClockEntry; // Ajustado para o seu pacote Model
import projeto_integrador.repositories.ClockEntryRepository; // Ajustado para o seu pacote Repository

import projeto_integrador.user.model.User; // **Assumindo que sua classe User está em projeto_integrador.user.model**
import projeto_integrador.user.repository.UserRepository; // **Assumindo que seu UserRepository está em projeto_integrador.user.repository**

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ClockEntryService {

    private final ClockEntryRepository clockEntryRepository;
    private final UserRepository userRepository; // Para buscar o usuário

    @Autowired
    public ClockEntryService(ClockEntryRepository clockEntryRepository, UserRepository userRepository) {
        this.clockEntryRepository = clockEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional // Garante que a operação seja atômica
    public ClockEntryResponse registrarPonto(ClockEntryRequest request) {
        // 1. Buscar o usuário pelo ID
        // **IMPORTANTE:** Certifique-se de que o UserRepository está configurado e que há usuários no seu DB.
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + request.getUserId()));

        // 2. Criar a entidade ClockEntry a partir do DTO de requisição
        // Os valores de latitude, longitude e precisao são definidos como 0.0f se forem nulos.
        ClockEntry clockEntry = ClockEntry.builder()
                .user(user) // Associa o usuário encontrado
                .tipo(request.getTipo())
                .timestamp(request.getTimestamp())
                .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0f)
                .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0f)
                .precisao(request.getPrecisaos() != null ? request.getPrecisao() : 0.0f)
                .fonte(request.getFonte())
                .deviceId(request.getDeviceId())
                .ip(request.getIp())
                .build();

        // createdAt será preenchido automaticamente pela anotação @CreationTimestamp na entidade ClockEntry

        // 3. Salvar a entidade no banco de dados
        ClockEntry savedClockEntry = clockEntryRepository.save(clockEntry);

        // 4. Converter a entidade salva para o DTO de resposta
        return ClockEntryResponse.builder()
                .id(savedClockEntry.getId())
                .userId(savedClockEntry.getUser().getId()) // Retorna o ID do usuário
                .tipo(savedClockEntry.getTipo())
                .timestamp(savedClockEntry.getTimestamp())
                .latitude(savedClockEntry.getLatitude())
                .longitude(savedClockEntry.getLongitude())
                .precisao(savedClockEntry.getPrecisao())
                .fonte(savedClockEntry.getFonte())
                .deviceId(savedClockEntry.getDeviceId())
                .ip(savedClockEntry.getIp())
                .createdAt(savedClockEntry.getCreatedAt())
                .build();
    }

    /**
     * Método para buscar um ponto de relógio pelo seu ID.
     *
     * @param id O ID do ponto de relógio a ser buscado.
     * @return ClockEntryResponse contendo os detalhes do ponto de relógio.
     * @throws IllegalArgumentException se o ponto de relógio não for encontrado.
     */
    public ClockEntryResponse buscarPontoPorId(Long id) {
        ClockEntry clockEntry = clockEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ponto não encontrado com ID: " + id));

        return ClockEntryResponse.builder()
                .id(clockEntry.getId())
                .userId(clockEntry.getUser().getId())
                .tipo(clockEntry.getTipo())
                .timestamp(clockEntry.getTimestamp())
                .latitude(clockEntry.getLatitude())
                .longitude(clockEntry.getLongitude())
                .precisao(clockEntry.getPreciso())
                .fonte(clockEntry.getFonte())
                .deviceId(clockEntry.getDeviceId())
                .ip(clockEntry.getIp())
                .createdAt(clockEntry.getCreatedAt())
                .build();
    }
}