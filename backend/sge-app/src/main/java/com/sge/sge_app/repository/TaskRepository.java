package com.sge.sge_app.repository;

import com.sge.sge_app.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
}