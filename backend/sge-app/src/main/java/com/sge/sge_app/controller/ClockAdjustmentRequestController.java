package com.sge.sge_app.controller;

import com.sge.sge_app.dto.request.ClockAdjustmentRequestDTO;
import com.sge.sge_app.dto.response.ClockAdjustmentResponseDTO;
import com.sge.sge_app.services.ClockAdjustmentRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clock-adjustments")
@RequiredArgsConstructor
public class ClockAdjustmentRequestController {

    private final ClockAdjustmentRequestService adjustmentService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ClockAdjustmentResponseDTO> createRequest(
            @Valid @RequestBody ClockAdjustmentRequestDTO dto,
            Authentication authentication) {
        ClockAdjustmentResponseDTO response = adjustmentService.createRequest(dto, authentication);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClockAdjustmentResponseDTO>> getMyRequests(Authentication authentication) {
        List<ClockAdjustmentResponseDTO> requests = adjustmentService.getMyRequests(authentication);
        return ResponseEntity.ok(requests);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClockAdjustmentResponseDTO>> getAllRequests() {
        List<ClockAdjustmentResponseDTO> requests = adjustmentService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClockAdjustmentResponseDTO>> getPendingRequests() {
        List<ClockAdjustmentResponseDTO> requests = adjustmentService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClockAdjustmentResponseDTO> reviewRequest(
            @PathVariable Long requestId,
            @RequestParam String action, // approve or reject
            Authentication authentication) {
        ClockAdjustmentResponseDTO response = adjustmentService.reviewRequest(requestId, action, authentication);
        return ResponseEntity.ok(response);
    }
}
