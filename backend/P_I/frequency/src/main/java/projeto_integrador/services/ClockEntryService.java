package projeto_integrador.services;

import projeto_integrador.dto.ClockEntryRequest;
import projeto_integrador.dto.ClockEntryResponse;
import projeto_integrador.models.ClockEntry;
import projeto_integrador.repositories.ClockEntryRepository;
import projeto_integrador.exception.ResourceNotFoundException;
import projeto_integrador.exception.BusinessException;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class ClockEntryService {

    private static final Set<String> VALID_TYPES = Set.of("ENTRY", "EXIT", "LUNCH_START", "LUNCH_END");

    private final ClockEntryRepository clockEntryRepository;

   // @Autowired
    public ClockEntryService(ClockEntryRepository clockEntryRepository) {
        this.clockEntryRepository = clockEntryRepository;
    }

    @Transactional
    public ClockEntryResponse registrarPonto(ClockEntryRequest request) {
        if (request.getUserId() == null) {
            throw new BusinessException("O ID do usuário é obrigatório");
        }

        String tipo = request.getTipo();
        if (tipo == null || !VALID_TYPES.contains(tipo)) {
            throw new BusinessException("Tipo de ponto inválido. Use: " + VALID_TYPES);
        }

        if ("EXIT".equals(tipo)) {
            boolean hasPreviousEntry = clockEntryRepository
                    .findTopByUserIdAndTipoOrderByCreatedAtDesc(request.getUserId(), "ENTRY")
                    .isPresent();
            if (!hasPreviousEntry) {
                throw new BusinessException("Não é possível registrar EXIT sem um ENTRY anterior");
            }
        }

        LocalDateTime timestamp = request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now();

        ClockEntry clockEntry = ClockEntry.builder()
                .userId(request.getUserId())
                .tipo(tipo)
                .timestamp(timestamp)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .precisao(request.getPrecisao())
                .fonte(request.getFonte())
                .deviceId(request.getDeviceId())
                .ip(request.getIp())
                .build();

        ClockEntry savedClockEntry = clockEntryRepository.save(clockEntry);

        return ClockEntryResponse.builder()
                .id(savedClockEntry.getId())
                .userId(savedClockEntry.getUserId())
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
                .userId(clockEntry.getUserId())
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
