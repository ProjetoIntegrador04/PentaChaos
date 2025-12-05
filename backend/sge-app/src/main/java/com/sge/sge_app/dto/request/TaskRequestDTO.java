package com.sge.sge_app.dto.request;

import lombok.Data;

@Data
public class TaskRequestDTO {

    private String titulo;
    private String descricao;

    private String status;         // PENDENTE, EM_ANDAMENTO, CONCLUIDA
    private String prioridade;     // Alta, Media, Baixa

    private String dataCriacao;    // yyyy-MM-dd
    private String dataConclusao;  // yyyy-MM-dd ou null

    private Long responsavelId;    // ESTAGIÁRIO
    private Long criadoPorId;      // COORDENADOR
}
