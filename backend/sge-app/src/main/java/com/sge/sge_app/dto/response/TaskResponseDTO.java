package com.sge.sge_app.dto.response;

import lombok.Data;

@Data
public class TaskResponseDTO {

    private Long id;

    private String titulo;
    private String descricao;

    private String status;
    private String prioridade;

    private String dataCriacao;
    private String dataConclusao;

    // Info do responsável (estagiário)
    private Long responsavelId;
    private String responsavelNome;
    private String responsavelEmail;

    // Info do criador (coordenador)
    private Long criadoPorId;
    private String criadoPorNome;
    private String criadoPorEmail;
}
