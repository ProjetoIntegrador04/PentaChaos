package com.sge.sge_app.controller;

import com.sge.sge_app.models.Task;
import com.sge.sge_app.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de tarefas (Tasks).
 * 
 * Regras de acesso:
 * - ADMIN (Gestor): Pode criar, editar, deletar e visualizar todas as tarefas
 * - USER (Estagiário): Pode apenas visualizar as tarefas atribuídas a ele
 */
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    /**
     * Lista todas as tarefas.
     * - ADMIN: Vê todas as tarefas
     * - USER: Vê apenas suas tarefas
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        List<Task> tasks = service.getAllTasks(authentication);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Busca uma tarefa específica por ID
     * - ADMIN: Pode ver qualquer tarefa
     * - USER: Pode ver apenas suas tarefas
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, Authentication authentication) {
        Task task = service.getTaskById(id, authentication);
        return ResponseEntity.ok(task);
    }

    /**
     * Cria uma nova tarefa.
     * Apenas ADMIN (Gestor) pode criar tarefas.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task, Authentication authentication) {
        Task createdTask = service.createTask(task, authentication);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * Atualiza uma tarefa existente.
     * Apenas ADMIN (Gestor) pode editar tarefas.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task, Authentication authentication) {
        Task updatedTask = service.updateTask(id, task, authentication);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Deleta uma tarefa.
     * Apenas ADMIN (Gestor) pode deletar tarefas.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        service.deleteTask(id, authentication);
        return ResponseEntity.noContent().build();
    }
}