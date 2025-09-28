package com.sge.sge_app.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass // Indica que esta classe não é uma entidade, mas suas propriedades serão
                  // mapeadas nas entidades filhas
@EntityListeners(AuditingEntityListener.class) // Habilita a auditoria automática para createdAt e updatedAt
public abstract class BaseEntity implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // Geração de ID automática e incremental
  protected Long id;

  @CreatedDate // Anotação do Spring Data JPA para definir o momento da criação
  @Column(name = "created_at", nullable = false, updatable = false)
  protected LocalDateTime createdAt;

  @LastModifiedDate // Anotação do Spring Data JPA para definir o momento da última atualização
  @Column(name = "updated_at")
  protected LocalDateTime updatedAt;

  @PrePersist // Método que será executado antes de persistir a entidade
  protected void onCreate() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
    if (this.updatedAt == null) {
      this.updatedAt = LocalDateTime.now();
    }
  }

  @PreUpdate // Método que será executado antes de atualizar a entidade
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}