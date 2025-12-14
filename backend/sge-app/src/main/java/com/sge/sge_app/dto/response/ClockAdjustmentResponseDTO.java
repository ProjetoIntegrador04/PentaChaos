package com.sge.sge_app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClockAdjustmentResponseDTO {
    
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String requestDate;
    private String entryTime;
    private String lunchStartTime;
    private String lunchEndTime;
    private String exitTime;
    private String justification;
    private String status;
    private Long reviewedBy;
    private String reviewedByName;
    private String reviewedAt;
    private String createdAt;
}
