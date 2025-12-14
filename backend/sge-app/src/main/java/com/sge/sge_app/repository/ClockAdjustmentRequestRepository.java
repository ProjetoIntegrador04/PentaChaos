package com.sge.sge_app.repository;

import com.sge.sge_app.models.ClockAdjustmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClockAdjustmentRequestRepository extends JpaRepository<ClockAdjustmentRequest, Long> {
    
    List<ClockAdjustmentRequest> findByUserId(Long userId);
    
    List<ClockAdjustmentRequest> findByStatus(String status);
    
    List<ClockAdjustmentRequest> findByStatusOrderByCreatedAtDesc(String status);
    
    List<ClockAdjustmentRequest> findAllByOrderByCreatedAtDesc();
}
