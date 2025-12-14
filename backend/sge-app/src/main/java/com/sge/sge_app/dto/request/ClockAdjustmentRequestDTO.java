package com.sge.sge_app.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClockAdjustmentRequestDTO {
    
    @NotNull(message = "Data da solicitação é obrigatória")
    private String requestDate; // formato: yyyy-MM-dd
    
    private String entryTime; // formato: HH:mm
    private String lunchStartTime;
    private String lunchEndTime;
    private String exitTime;
    
    private String justification;
}
