package com.sge.sge_app.services;

import com.sge.sge_app.dto.request.ClockEntryRequest;
import com.sge.sge_app.dto.response.ClockEntryResponse;
import com.sge.sge_app.models.ClockEntry;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.repository.ClockEntryRepository;
import com.sge.sge_app.repository.UserRepository;
import com.sge.sge_app.exception.BusinessException;
import com.sge.sge_app.exception.ResourceNotFoundException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClockEntryService {

    private static final Set<String> VALID_TYPES = Set.of("ENTRY", "EXIT", "LUNCH_START", "LUNCH_END");
    private static final Set<String> VALID_SOURCES = Set.of("WEB", "MOBILE_ANDROID", "MOBILE_IOS");

    private final ClockEntryRepository clockEntryRepository;
    private final UserRepository userRepository;

    public ClockEntryService(ClockEntryRepository clockEntryRepository, UserRepository userRepository) {
        this.clockEntryRepository = clockEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ClockEntryResponse registrarPonto(ClockEntryRequest request, Authentication authentication) {
        // Obter usuário autenticado e definir no request
        User user = obterUsuarioAutenticado(authentication);
        request.setUserId(user.getId());
        
        // Validações básicas
        validarDadosBasicos(request);
        
        // Validar regras de negócio específicas
        validarRegrasDeNegocio(request);
        
        // Validar geolocalização (se necessário)
        validarGeolocalizacao(request.getLatitude(), request.getLongitude());

        LocalDateTime timestamp = request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now();

        ClockEntry clockEntry = ClockEntry.builder()
                .userId(request.getUserId())
                .tipo(request.getTipo())
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

    private void validarDadosBasicos(ClockEntryRequest request) {
        if (request.getUserId() == null) {
            throw new BusinessException("O ID do usuário é obrigatório");
        }

        String tipo = request.getTipo();
        if (tipo == null || !VALID_TYPES.contains(tipo)) {
            throw new BusinessException("Tipo de ponto inválido. Use: " + VALID_TYPES);
        }

        String fonte = request.getFonte();
        if (fonte == null || !VALID_SOURCES.contains(fonte)) {
            throw new BusinessException("Fonte inválida. Use: " + VALID_SOURCES);
        }

        // Validar se não está tentando bater ponto no futuro
        LocalDateTime timestamp = request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now();
        if (timestamp.isAfter(LocalDateTime.now().plusMinutes(5))) { // Tolerância de 5 minutos
            throw new BusinessException("Não é possível registrar ponto no futuro");
        }
    }

    private User obterUsuarioAutenticado(Authentication authentication) {
        // Buscar usuário por username/email do token
        String username = authentication.getName();
        return userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
    }

    private void validarRegrasDeNegocio(ClockEntryRequest request) {
        String tipo = request.getTipo();
        Long userId = request.getUserId();
        LocalDate hoje = LocalDate.now();

        switch (tipo) {
            case "EXIT":
                // Verificar se existe ENTRY sem EXIT no mesmo dia
                Optional<ClockEntry> ultimoEntry = clockEntryRepository
                        .findTopByUserIdAndTipoOrderByCreatedAtDesc(userId, "ENTRY");
                if (ultimoEntry.isEmpty()) {
                    throw new BusinessException("Não é possível registrar EXIT sem um ENTRY anterior");
                }
                
                // Verificar se o ENTRY é do mesmo dia
                if (!ultimoEntry.get().getTimestamp().toLocalDate().equals(hoje)) {
                    throw new BusinessException("EXIT deve ser registrado no mesmo dia do ENTRY");
                }
                break;

            case "ENTRY":
                // Verificar se já existe ENTRY sem EXIT no mesmo dia
                List<ClockEntry> pontosHoje = clockEntryRepository.findByUserIdAndTimestampBetween(
                        userId, hoje.atStartOfDay(), hoje.plusDays(1).atStartOfDay());
                
                long entriesHoje = pontosHoje.stream().filter(p -> "ENTRY".equals(p.getTipo())).count();
                long exitsHoje = pontosHoje.stream().filter(p -> "EXIT".equals(p.getTipo())).count();
                
                if (entriesHoje > exitsHoje) {
                    throw new BusinessException("Já existe um ENTRY sem EXIT registrado hoje");
                }
                break;

            case "LUNCH_START":
                // Verificar se já existe ENTRY hoje e não existe LUNCH_START sem LUNCH_END
                validarAlmocoStart(userId, hoje);
                break;

            case "LUNCH_END":
                // Verificar se existe LUNCH_START sem LUNCH_END
                validarAlmocoEnd(userId, hoje);
                break;
        }
    }

    private void validarAlmocoStart(Long userId, LocalDate hoje) {
        List<ClockEntry> pontosHoje = clockEntryRepository.findByUserIdAndTimestampBetween(
                userId, hoje.atStartOfDay(), hoje.plusDays(1).atStartOfDay());

        boolean hasEntry = pontosHoje.stream().anyMatch(p -> "ENTRY".equals(p.getTipo()));
        if (!hasEntry) {
            throw new BusinessException("Não é possível iniciar almoço sem registrar entrada");
        }

        long lunchStarts = pontosHoje.stream().filter(p -> "LUNCH_START".equals(p.getTipo())).count();
        long lunchEnds = pontosHoje.stream().filter(p -> "LUNCH_END".equals(p.getTipo())).count();

        if (lunchStarts > lunchEnds) {
            throw new BusinessException("Já existe um LUNCH_START sem LUNCH_END registrado hoje");
        }
    }

    private void validarAlmocoEnd(Long userId, LocalDate hoje) {
        Optional<ClockEntry> ultimoLunchStart = clockEntryRepository
                .findTopByUserIdAndTipoOrderByCreatedAtDesc(userId, "LUNCH_START");
        
        if (ultimoLunchStart.isEmpty() || 
            !ultimoLunchStart.get().getTimestamp().toLocalDate().equals(hoje)) {
            throw new BusinessException("Não é possível finalizar almoço sem iniciar almoço hoje");
        }
    }

    private void validarGeolocalizacao(Float latitude, Float longitude) {
        // Validações básicas de coordenadas
        if (latitude == null || longitude == null) {
            throw new BusinessException("Latitude e longitude são obrigatórias");
        }

        if (latitude < -90 || latitude > 90) {
            throw new BusinessException("Latitude deve estar entre -90 e 90 graus");
        }

        if (longitude < -180 || longitude > 180) {
            throw new BusinessException("Longitude deve estar entre -180 e 180 graus");
        }

        // TODO: Implementar validação de perímetro da empresa
        // if (!validarPerimetroEmpresa(latitude, longitude)) {
        //     throw new BusinessException("Localização fora do perímetro permitido");
        // }
    }

    public List<ClockEntryResponse> buscarPontosDoUsuarioHoje(Authentication authentication) {
        User user = obterUsuarioAutenticado(authentication);
        LocalDate hoje = LocalDate.now();
        LocalDateTime startOfDay = hoje.atStartOfDay();
        LocalDateTime endOfDay = hoje.plusDays(1).atStartOfDay();

        List<ClockEntry> pontos = clockEntryRepository.findByUserIdAndTimestampBetween(
                user.getId(), startOfDay, endOfDay);

        return pontos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Método simplificado - retorna últimos 90 dias
    public List<ClockEntryResponse> buscarHistoricoSimples(Authentication authentication) {
        User user = obterUsuarioAutenticado(authentication);
        
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(90);

        List<ClockEntry> pontos = clockEntryRepository.findByUserIdAndTimestampBetween(
                user.getId(), startDate, endDate);

        return pontos.stream()
                .map(this::convertToResponse)
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp())) // Mais recentes primeiro
                .collect(Collectors.toList());
    }

    public List<ClockEntryResponse> buscarHistoricoPontos(
            Authentication authentication, String startDateStr, String endDateStr) {
        User user = obterUsuarioAutenticado(authentication);
        
        LocalDateTime startDate;
        LocalDateTime endDate;
        
        if (startDateStr != null && endDateStr != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            startDate = LocalDate.parse(startDateStr, formatter).atStartOfDay();
            endDate = LocalDate.parse(endDateStr, formatter).plusDays(1).atStartOfDay();
        } else {
            // Por padrão, últimos 30 dias
            endDate = LocalDateTime.now();
            startDate = endDate.minusDays(30);
        }

        List<ClockEntry> pontos = clockEntryRepository.findByUserIdAndTimestampBetween(
                user.getId(), startDate, endDate);

        return pontos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ClockEntryResponse> buscarPontosUsuarioPorData(
            Long userId, String startDateStr, String endDateStr) {
        
        LocalDateTime startDate;
        LocalDateTime endDate;
        
        if (startDateStr != null && endDateStr != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            startDate = LocalDate.parse(startDateStr, formatter).atStartOfDay();
            endDate = LocalDate.parse(endDateStr, formatter).plusDays(1).atStartOfDay();
        } else {
            // Se não fornecido, busca hoje
            LocalDate hoje = LocalDate.now();
            startDate = hoje.atStartOfDay();
            endDate = hoje.plusDays(1).atStartOfDay();
        }

        List<ClockEntry> pontos = clockEntryRepository.findByUserIdAndTimestampBetween(
                userId, startDate, endDate);

        return pontos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ClockEntryResponse convertToResponse(ClockEntry clockEntry) {
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
