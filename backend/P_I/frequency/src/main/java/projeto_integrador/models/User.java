// C:\Users\gabri\OneDrive\Área de Trabalho\PentaChaos\backend\P_I\user\src\main\java\projeto_integrador\user\model\User.java
package projeto_integrador.user.models; // Ajustado para o pacote do seu módulo de usuário

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // Nome da tabela no banco de dados
@Data // Lombok: Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Lombok: Gera construtor sem argumentos
@AllArgsConstructor // Lombok: Gera construtor com todos os argumentos
@Builder // Lombok: Gera um builder para construção de objetos
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nome;
    @Column(nullable = false, unique = true)
    private String email;
    private String role; // Ex: "ESTAGIARIO", "GESTOR"
    private boolean ativo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Você pode ter mais campos aqui, como senha (criptografada!), telefones, etc.
}