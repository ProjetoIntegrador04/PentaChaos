package com.sge.sge_app.models;

import com.sge.sge_app.domain.model.User;
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

    private String status;        // PENDENTE, EM_ANDAMENTO, CONCLUIDA
    private String prioridade;    // Alta, Media, Baixa

    private String dataCriacao;   // yyyy-MM-dd
    private String dataConclusao; // yyyy-MM-dd ou null

    // Responsável (Estagiário)
    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private User responsavel;

    // Criador (Coordenador)
    @ManyToOne
    @JoinColumn(name = "criado_por_id")
    private User criadoPor;
}
