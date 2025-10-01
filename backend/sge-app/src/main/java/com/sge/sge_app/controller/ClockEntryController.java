package com.sge.sge_app.controller; // PACOTE CORRIGIDO COM BASE NO CAMINHO COMPLETO

import com.sge.sge_app.dto.request.ClockEntryRequest; // Importação corrigida
import com.sge.sge_app.dto.response.ClockEntryResponse; // Importação corrigida
import com.sge.sge_app.services.ClockEntryService; // Importação corrigida

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clockentries")
public class ClockEntryController {

    private final ClockEntryService clockEntryService;

    public ClockEntryController(ClockEntryService clockEntryService) {
        this.clockEntryService = clockEntryService;
    }

    @PostMapping
    public ResponseEntity<ClockEntryResponse> registrarPonto(
            @Valid @RequestBody ClockEntryRequest request,
            HttpServletRequest httpServletRequest) {

        if (request.getIp() == null || request.getIp().isEmpty()) {
            String clientIp = httpServletRequest.getRemoteAddr();
            request.setIp(clientIp);
        }

        ClockEntryResponse response = clockEntryService.registrarPonto(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClockEntryResponse> getClockEntryById(@PathVariable Long id) {
        ClockEntryResponse response = clockEntryService.buscarPontoPorId(id);
        return ResponseEntity.ok(response);
    }
}