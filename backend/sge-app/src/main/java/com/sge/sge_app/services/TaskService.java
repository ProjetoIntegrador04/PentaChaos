package com.sge.sge_app.services;

import com.sge.sge_app.models.Task;
import com.sge.sge_app.repository.TaskRepository;
import com.sge.sge_app.repository.UserRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import com.sge.sge_app.exception.ResourceNotFoundException;
import com.sge.sge_app.exception.BusinessException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciamento de tarefas.
 * 
 * Regras de negócio:
 * - ADMIN pode ver todas as tarefas e criar/editar/deletar
 * - USER pode ver apenas tarefas atribuídas a ele (por username)
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repository;
    private final UserRepository userRepository;

    /**
     * Lista tarefas baseado no perfil do usuário.
     * ADMIN: vê todas as tarefas
     * USER: vê apenas tarefas onde ele é o responsável
     */
    public List<Task> getAllTasks(Authentication authentication) {
        String username = authentication.getName();
        
        // Verificação correta de admin usando stream.anyMatch
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            // Admin vê todas as tarefas
            return repository.findAll();
        } else {
            // USER vê apenas suas tarefas
            return repository.findAll().stream()
                    .filter(task -> task.getResponsavel() != null && 
                                   username.equals(task.getResponsavel().getUsername()))
                    .collect(Collectors.toList());
        }
    }

    /**
     * Busca tarefa por ID com validação de permissão.
     * ADMIN: pode ver qualquer tarefa
     * USER: pode ver apenas suas tarefas
     */
    public Task getTaskById(@NonNull Long id, Authentication authentication) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        // Se não é admin e não é o responsável, não pode ver
        if (!isAdmin && (task.getResponsavel() == null || !username.equals(task.getResponsavel().getUsername()))) {
            throw new BusinessException("Você não tem permissão para visualizar esta tarefa");
        }

        return task;
    }

    /**
     * Cria uma nova tarefa (apenas ADMIN).
     * Define automaticamente a data de criação.
     */
    public Task createTask(Task task, Authentication authentication) {
        // Valida se o responsável existe
        if (task.getResponsavel() != null && task.getResponsavel().getId() != null) {
            userRepository.findById((Long) task.getResponsavel().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário responsável não encontrado com ID: " + task.getResponsavel().getId()));
        }

        // Define data de criação se não foi definida
        if (task.getDataCriacao() == null || task.getDataCriacao().isEmpty()) {
            task.setDataCriacao(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        // Define status padrão se não foi definido
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("PENDENTE");
        }

        @SuppressWarnings("null")
        Task result = repository.save(task);
        return result;
    }

    /**
     * Atualiza uma tarefa existente (apenas ADMIN).
     */
    public Task updateTask(@NonNull Long id, Task taskDetails, Authentication authentication) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        // Valida se o novo responsável existe
        if (taskDetails.getResponsavel() != null && taskDetails.getResponsavel().getId() != null) {
            @SuppressWarnings("null")
            Long userId = taskDetails.getResponsavel().getId();
            userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário responsável não encontrado com ID: " + userId));
        }

        // Atualiza os campos
        if (taskDetails.getTitulo() != null) {
            task.setTitulo(taskDetails.getTitulo());
        }
        if (taskDetails.getDescricao() != null) {
            task.setDescricao(taskDetails.getDescricao());
        }
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
        }
        if (taskDetails.getPrioridade() != null) {
            task.setPrioridade(taskDetails.getPrioridade());
        }
        if (taskDetails.getResponsavel() != null) {
            task.setResponsavel(taskDetails.getResponsavel());
        }
        if (taskDetails.getDataConclusao() != null) {
            task.setDataConclusao(taskDetails.getDataConclusao());
        }

        return repository.save(task);
    }

    /**
     * Deleta uma tarefa (apenas ADMIN).
     */
    public void deleteTask(@NonNull Long id, Authentication authentication) {
        repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
        
        repository.deleteById(id);
    }
}

