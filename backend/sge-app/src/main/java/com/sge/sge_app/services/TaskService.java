package com.sge.sge_app.services;

import com.sge.sge_app.dto.request.TaskRequestDTO;
import com.sge.sge_app.dto.response.TaskResponseDTO;
import com.sge.sge_app.mappers.TaskMapper;
import com.sge.sge_app.models.Task;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.repository.TaskRepository;
import com.sge.sge_app.repository.UserRepository;
<<<<<<< HEAD
import com.sge.sge_app.exception.ResourceNotFoundException;
import com.sge.sge_app.exception.BusinessException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
=======
import lombok.RequiredArgsConstructor;
>>>>>>> feature/functions-integrations
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

<<<<<<< HEAD
    private final TaskRepository repository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

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
                    .filter(task -> username.equals(task.getResponsavel()))
                    .collect(Collectors.toList());
        }
    }

    /**
     * Busca tarefa por ID com validação de permissão.
     * ADMIN: pode ver qualquer tarefa
     * USER: pode ver apenas suas tarefas
     */
    public Task getTaskById(Long id, Authentication authentication) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        // Se não é admin e não é o responsável, não pode ver
        if (!isAdmin && !username.equals(task.getResponsavel())) {
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
        if (task.getResponsavel() != null && !task.getResponsavel().isEmpty()) {
            userRepository.findByUsername(task.getResponsavel())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário responsável não encontrado: " + task.getResponsavel()));
        }

        // Define data de criação se não foi definida
        if (task.getDataCriacao() == null || task.getDataCriacao().isEmpty()) {
            task.setDataCriacao(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        // Define status padrão se não foi definido
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("PENDENTE");
        }

        return repository.save(task);
    }

    /**
     * Atualiza uma tarefa existente (apenas ADMIN).
     */
    public Task updateTask(Long id, Task taskDetails, Authentication authentication) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        // Valida se o novo responsável existe
        if (taskDetails.getResponsavel() != null && !taskDetails.getResponsavel().isEmpty()) {
            userRepository.findByUsername(taskDetails.getResponsavel())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário responsável não encontrado: " + taskDetails.getResponsavel()));
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
    public void deleteTask(Long id, Authentication authentication) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
        
        repository.deleteById(id);
=======
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    // -------------------------
    //       CREATE
    // -------------------------
    public TaskResponseDTO createTask(TaskRequestDTO dto) {

        User responsavel = userRepository.findById(dto.getResponsavelId())
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));

        User criadoPor = userRepository.findById(dto.getCriadoPorId())
                .orElseThrow(() -> new RuntimeException("Criador não encontrado"));

        Task task = taskMapper.toEntity(dto, responsavel, criadoPor);
        Task saved = taskRepository.save(task);

        return taskMapper.toDTO(saved);
    }

    // -------------------------
    //       UPDATE (PUT)
    // -------------------------
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO dto) {

        Task t = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Atualizar campos
        t.setTitulo(dto.getTitulo());
        t.setDescricao(dto.getDescricao());
        t.setStatus(dto.getStatus());
        t.setPrioridade(dto.getPrioridade());
        t.setDataCriacao(dto.getDataCriacao());
        t.setDataConclusao(dto.getDataConclusao());

        // Atualizar responsável (se vier no DTO)
        if (dto.getResponsavelId() != null) {
            User resp = userRepository.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));
            t.setResponsavel(resp);
        }

        // Criador nunca muda (mas se vier, ignora)
        
        Task updated = taskRepository.save(t);
        return taskMapper.toDTO(updated);
    }

    // -------------------------
    //       LIST ALL
    // -------------------------
    public List<TaskResponseDTO> listAll() {
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toDTO)
                .toList();
>>>>>>> feature/functions-integrations
    }

    // -------------------------
    //  LISTAR POR RESPONSÁVEL (ESTAGIÁRIO)
    // -------------------------
    public List<TaskResponseDTO> listByResponsavel(Long userId) {
        return taskRepository.findByResponsavel_Id(userId)
                .stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    // -------------------------
    //  LISTAR POR CRIADOR (COORDENADOR)
    // -------------------------
    public List<TaskResponseDTO> listByCriadoPor(Long coordId) {
        return taskRepository.findByCriadoPor_Id(coordId)
                .stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    // -------------------------
    //       DELETE
    // -------------------------
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tarefa não encontrada para exclusão.");
        }
        taskRepository.deleteById(id);
    }
}
