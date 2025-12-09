package com.sge.sge_app.mappers;

import com.sge.sge_app.dto.request.TaskRequestDTO;
import com.sge.sge_app.dto.response.TaskResponseDTO;
import com.sge.sge_app.models.Task;
import com.sge.sge_app.domain.model.User;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(TaskRequestDTO dto, User responsavel, User criadoPor) {
        Task t = new Task();
        t.setTitulo(dto.getTitulo());
        t.setDescricao(dto.getDescricao());
        t.setStatus(dto.getStatus());
        t.setPrioridade(dto.getPrioridade());
        t.setDataCriacao(dto.getDataCriacao());
        t.setDataConclusao(dto.getDataConclusao());
        t.setResponsavel(responsavel);
        t.setCriadoPor(criadoPor);
        return t;
    }

    public TaskResponseDTO toDTO(Task t) {
        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(t.getId());
        dto.setTitulo(t.getTitulo());
        dto.setDescricao(t.getDescricao());
        dto.setStatus(t.getStatus());
        dto.setPrioridade(t.getPrioridade());
        dto.setDataCriacao(t.getDataCriacao());
        dto.setDataConclusao(t.getDataConclusao());

        // Responsável
        if (t.getResponsavel() != null) {
            dto.setResponsavelId(t.getResponsavel().getId());
            dto.setResponsavelNome(t.getResponsavel().getUsername()); // <<< AQUI
            dto.setResponsavelEmail(t.getResponsavel().getEmail());
        }

        // Criado por (coordenador)
        if (t.getCriadoPor() != null) {
            dto.setCriadoPorId(t.getCriadoPor().getId());
            dto.setCriadoPorNome(t.getCriadoPor().getUsername()); // <<< AQUI
            dto.setCriadoPorEmail(t.getCriadoPor().getEmail());
        }

        return dto;
    }
}
