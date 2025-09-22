package projeto_integrador.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data // Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Construtor sem argumentos
@AllArgsConstructor // Construtor com todos os argumentos (necessário para o @Builder)
@Builder // Gera o builder
public class ClockEntryResponse {

    private Long id;
    private Long userId;
    private String tipo;
    private LocalDateTime timestamp;
    private Float latitude;
    private Float longitude;
    private Float precisao;
    private String fonte;
    private String deviceId;
    private String ip;
    private LocalDateTime createdAt;
}