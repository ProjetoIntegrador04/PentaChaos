package com.sge.sge_app.controller; // PACOTE CORRIGIDO COM BASE NO CAMINHO COMPLETO

import com.sge.sge_app.dto.request.ClockEntryRequest; // Importação corrigida
import com.sge.sge_app.dto.response.ClockEntryResponse; // Importação corrigida
import com.sge.sge_app.services.ClockEntryService; // Importação corrigida

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

    public ClockEntryController(ClockEntryService clockEntryService) {
        this.clockEntryService = clockEntryService;
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
}