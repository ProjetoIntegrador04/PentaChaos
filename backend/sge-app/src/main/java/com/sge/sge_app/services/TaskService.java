package com.sge.sge_app.services;

import com.sge.sge_app.dto.request.TaskRequestDTO;
import com.sge.sge_app.dto.response.TaskResponseDTO;
import com.sge.sge_app.mappers.TaskMapper;
import com.sge.sge_app.models.Task;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.repository.TaskRepository;
import com.sge.sge_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

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
