package com.sge.sge_app.models;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Task {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String titulo;
    private String descricao;
    private String prioridade;
    private String responsavel;
    private String dataCriacao;
    private String dataConclusao;

    private String status; // Ex: "PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"

}