package com.sge.sge_app.controller; 

import com.sge.sge_app.dto.request.ClockEntryRequest; 
import com.sge.sge_app.dto.response.ClockEntryResponse; 
import com.sge.sge_app.services.ClockEntryService; 
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clockentries")
public class ClockEntryController {

    private final ClockEntryService clockEntryService;
    private final UserRepository userRepository;

    public ClockEntryController(ClockEntryService clockEntryService, UserRepository userRepository) {
        this.clockEntryService = clockEntryService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ClockEntryResponse> registrarPonto(
            @Valid @RequestBody ClockEntryRequest request,
            HttpServletRequest httpServletRequest,
            Authentication authentication) {

        // Capturar IP automaticamente se não fornecido
        if (request.getIp() == null || request.getIp().isEmpty()) {
            String clientIp = httpServletRequest.getRemoteAddr();
            request.setIp(clientIp);
        }

        // Registrar ponto com validação de usuário autenticado
        ClockEntryResponse response = clockEntryService.registrarPonto(request, authentication);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ClockEntryResponse> getClockEntryById(@PathVariable Long id, Authentication authentication) {
        ClockEntryResponse response = clockEntryService.buscarPontoPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/today")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClockEntryResponse>> getMeusPontosHoje(Authentication authentication) {
        List<ClockEntryResponse> pontos = clockEntryService.buscarPontosDoUsuarioHoje(authentication);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/me/history")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClockEntryResponse>> getMeuHistoricoPontos(Authentication authentication) {
        List<ClockEntryResponse> pontos = clockEntryService.buscarHistoricoSimples(authentication);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/users/{userId}/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClockEntryResponse>> getPontosUsuarioHoje(@PathVariable Long userId) {
        List<ClockEntryResponse> pontos = clockEntryService.buscarPontosUsuarioPorData(userId, null, null);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/users/{userId}/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClockEntryResponse>> getPontosUsuarioPorData(
            @PathVariable Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<ClockEntryResponse> pontos = clockEntryService.buscarPontosUsuarioPorData(userId, startDate, endDate);
        return ResponseEntity.ok(pontos);
    }

    @GetMapping("/me/frequency")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Double> getMinhaFrequencia(
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        double frequencia = clockEntryService.calcularFrequencia(user.getId(), days);
        return ResponseEntity.ok(frequencia);
    }

    @GetMapping("/users/{userId}/frequency")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Double> getFrequenciaUsuario(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "30") int days) {
        double frequencia = clockEntryService.calcularFrequencia(userId, days);
        return ResponseEntity.ok(frequencia);
    }
}