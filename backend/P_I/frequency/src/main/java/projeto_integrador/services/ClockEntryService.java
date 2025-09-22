package projeto_integrador.services;

import projeto_integrador.dto.ClockEntryRequest;
import projeto_integrador.dto.ClockEntryResponse;
import projeto_integrador.models.ClockEntry;
import projeto_integrador.repositories.ClockEntryRepository;
import projeto_integrador.exceptions.ResourceNotFoundException;
import projeto_integrador.exceptions.InvalidClockEntryException;

import projeto_integrador.user.models.User;
import projeto_integrador.user.repository.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ClockEntryService {

    private final ClockEntryRepository clockEntryRepository;
    private final UserRepository userRepository;

    @Autowired
    public ClockEntryService(ClockEntryRepository clockEntryRepository, UserRepository userRepository) {
        this.clockEntryRepository = clockEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ClockEntryResponse registrarPonto(ClockEntryRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + request.getUserId()));

        if (request.getTipo() == null || (!request.getTipo().equals("ENTRADA") && !request.getTipo().equals("SAIDA"))) {
            throw new InvalidClockEntryException("Tipo de ponto inválido. Deve ser 'ENTRADA' ou 'SAIDA'.");
        }

        if (request.getTipo().equals("SAIDA")) {
            boolean hasOpenEntry = clockEntryRepository.findByUserId(request.getUserId())
                                      .stream()
                                      .filter(ce -> ce.getTipo().equals("ENTRADA") && ce.getTimestamp() != null && ce.getOutTime() == null)
                                      .findFirst()
                                      .isPresent();
            if (!hasOpenEntry) {
                 throw new InvalidClockEntryException("Não é possível registrar SAÍDA sem um registro de ENTRADA ativo.");
            }
        }

        ClockEntry clockEntry = ClockEntry.builder()
                .user(user)
                .tipo(request.getTipo())
                .timestamp(request.getTimestamp())
                .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0f)
                .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0f)
                .precisao(request.getPrecisao() != null ? request.getPrecisao() : 0.0f)
                .fonte(request.getFonte())
                .deviceId(request.getDeviceId())
                .ip(request.getIp())
                .build();

        ClockEntry savedClockEntry = clockEntryRepository.save(clockEntry);

        return ClockEntryResponse.builder()
                .id(savedClockEntry.getId())
                .userId(savedClockEntry.getUser().getId())
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

    public ClockEntryResponse buscarPontoPorId(Long id) {
        ClockEntry clockEntry = clockEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado com ID: " + id));

        return ClockEntryResponse.builder()
                .id(clockEntry.getId())
                .userId(clockEntry.getUser().getId())
                .tipo(clockEntry.getTipo())
                .timestamp(clockEntry.getTimestamp())
                .latitude(clockEntry.getLatitude())
                .longitude(clockEntry.getLongitude())
                .precisao(clockEntry.getPrecisao())
                .fonte(clockEntry.getFonte())
                .deviceId(clockEntry.getDeviceId())
                .ip(clockEntry.getIp())
                .createdAt(clockEntry.getCreatedAt())
                .build();
    }
}