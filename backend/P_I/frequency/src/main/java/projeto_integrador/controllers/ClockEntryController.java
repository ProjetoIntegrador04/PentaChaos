package projeto_integrador.controllers;

import projeto_integrador.dto.ClockEntryRequest;
import projeto_integrador.dto.ClockEntryResponse;
import projeto_integrador.services.ClockEntryService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clockentries")
public class ClockEntryController {

    private final ClockEntryService clockEntryService;

    @Autowired
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