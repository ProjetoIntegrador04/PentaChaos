package com.sge.sge_app.services;

import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.request.ClockAdjustmentRequestDTO;
import com.sge.sge_app.dto.response.ClockAdjustmentResponseDTO;
import com.sge.sge_app.exception.ResourceNotFoundException;
import com.sge.sge_app.models.ClockAdjustmentRequest;
import com.sge.sge_app.repository.ClockAdjustmentRequestRepository;
import com.sge.sge_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClockAdjustmentRequestService {

    private final ClockAdjustmentRequestRepository adjustmentRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public ClockAdjustmentResponseDTO createRequest(ClockAdjustmentRequestDTO dto, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        ClockAdjustmentRequest request = ClockAdjustmentRequest.builder()
                .userId(user.getId())
                .requestDate(LocalDate.parse(dto.getRequestDate()))
                .entryTime(dto.getEntryTime() != null ? LocalTime.parse(dto.getEntryTime()) : null)
                .lunchStartTime(dto.getLunchStartTime() != null ? LocalTime.parse(dto.getLunchStartTime()) : null)
                .lunchEndTime(dto.getLunchEndTime() != null ? LocalTime.parse(dto.getLunchEndTime()) : null)
                .exitTime(dto.getExitTime() != null ? LocalTime.parse(dto.getExitTime()) : null)
                .justification(dto.getJustification())
                .status("PENDING")
                .build();

        ClockAdjustmentRequest saved = adjustmentRepository.save(request);
        return convertToDTO(saved, user);
    }

    public List<ClockAdjustmentResponseDTO> getMyRequests(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<ClockAdjustmentRequest> requests = adjustmentRepository.findByUserId(user.getId());
        return requests.stream()
                .map(req -> convertToDTO(req, user))
                .collect(Collectors.toList());
    }

    public List<ClockAdjustmentResponseDTO> getAllRequests() {
        List<ClockAdjustmentRequest> requests = adjustmentRepository.findAllByOrderByCreatedAtDesc();
        return requests.stream()
                .map(this::convertToDTOWithUserInfo)
                .collect(Collectors.toList());
    }

    public List<ClockAdjustmentResponseDTO> getPendingRequests() {
        List<ClockAdjustmentRequest> requests = adjustmentRepository.findByStatusOrderByCreatedAtDesc("PENDING");
        return requests.stream()
                .map(this::convertToDTOWithUserInfo)
                .collect(Collectors.toList());
    }

    public ClockAdjustmentResponseDTO reviewRequest(Long requestId, String action, Authentication authentication) {
        User reviewer = getAuthenticatedUser(authentication);
        
        ClockAdjustmentRequest request = adjustmentRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação não encontrada"));

        if ("approve".equalsIgnoreCase(action)) {
            request.setStatus("APPROVED");
        } else if ("reject".equalsIgnoreCase(action)) {
            request.setStatus("REJECTED");
        }

        request.setReviewedBy(reviewer.getId());
        request.setReviewedAt(java.time.LocalDateTime.now());

        ClockAdjustmentRequest updated = adjustmentRepository.save(request);
        return convertToDTOWithUserInfo(updated);
    }

    private ClockAdjustmentResponseDTO convertToDTO(ClockAdjustmentRequest request, User user) {
        return ClockAdjustmentResponseDTO.builder()
                .id(request.getId())
                .userId(request.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .requestDate(request.getRequestDate().toString())
                .entryTime(request.getEntryTime() != null ? request.getEntryTime().toString() : null)
                .lunchStartTime(request.getLunchStartTime() != null ? request.getLunchStartTime().toString() : null)
                .lunchEndTime(request.getLunchEndTime() != null ? request.getLunchEndTime().toString() : null)
                .exitTime(request.getExitTime() != null ? request.getExitTime().toString() : null)
                .justification(request.getJustification())
                .status(request.getStatus())
                .reviewedBy(request.getReviewedBy())
                .reviewedAt(request.getReviewedAt() != null ? request.getReviewedAt().toString() : null)
                .createdAt(request.getCreatedAt().toString())
                .build();
    }

    private ClockAdjustmentResponseDTO convertToDTOWithUserInfo(ClockAdjustmentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElse(null);

        User reviewer = request.getReviewedBy() != null 
                ? userRepository.findById(request.getReviewedBy()).orElse(null)
                : null;

        return ClockAdjustmentResponseDTO.builder()
                .id(request.getId())
                .userId(request.getUserId())
                .username(user != null ? user.getUsername() : "Desconhecido")
                .fullName(user != null ? user.getFullName() : "Desconhecido")
                .requestDate(request.getRequestDate().toString())
                .entryTime(request.getEntryTime() != null ? request.getEntryTime().toString() : null)
                .lunchStartTime(request.getLunchStartTime() != null ? request.getLunchStartTime().toString() : null)
                .lunchEndTime(request.getLunchEndTime() != null ? request.getLunchEndTime().toString() : null)
                .exitTime(request.getExitTime() != null ? request.getExitTime().toString() : null)
                .justification(request.getJustification())
                .status(request.getStatus())
                .reviewedBy(request.getReviewedBy())
                .reviewedByName(reviewer != null ? reviewer.getFullName() : null)
                .reviewedAt(request.getReviewedAt() != null ? request.getReviewedAt().toString() : null)
                .createdAt(request.getCreatedAt().toString())
                .build();
    }
}
