package com.sge.sge_app.repository;

import com.sge.sge_app.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Estagiário → lista tarefas em que ele é o responsável
    List<Task> findByResponsavel_Id(Long responsavelId);

    // Coordenador → lista tarefas que ele criou
    List<Task> findByCriadoPor_Id(Long criadoPorId);
}
