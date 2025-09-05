// C:\Users\gabri\OneDrive\Área de Trabalho\PentaChaos\backend\P_I\frequency\src\main\java\projeto_integrador\repository\ClockEntryRepository.java
package projeto_integrador.repositories; // Ajustado para o seu pacote

import projeto_integrador.models.ClockEntry; // Ajustado para o seu pacote Model
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Indica que esta interface é um componente de repositório do Spring
public interface ClockEntryRepository extends JpaRepository<ClockEntry, Long> {
    // JpaRepository<T, ID> fornece métodos de CRUD básicos:
    // save(), findById(), findAll(), delete(), etc.

    // Você pode adicionar métodos de consulta personalizados aqui.
    // O Spring Data JPA automaticamente implementa esses métodos com base no nome.

    /**
     * Encontra todos os registros de ponto para um determinado ID de usuário.
     * @param userId O ID do usuário.
     * @return Uma lista de ClockEntry associados ao userId.
     */
    List<ClockEntry> findByUserId(Long userId);

    // Exemplo de outro método personalizado (se precisar no futuro):
    // List<ClockEntry> findByTipoAndUserId(String tipo, Long userId);
}