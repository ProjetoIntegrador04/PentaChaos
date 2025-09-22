package projeto_integrador.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data // Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Construtor sem argumentos
@AllArgsConstructor // Construtor com todos os argumentos (necessário para o @Builder)
@Builder // Gera o builder
public class ClockEntryRequest {

    @NotNull(message = "O ID do usuário é obrigatório.")
    private Long userId;

    @NotBlank(message = "O tipo de ponto é obrigatório.")
    @Pattern(regexp = "^(ENTRY|EXIT|LUNCH_START|LUNCH_END)$", message = "Tipo de ponto inválido.")
    private String tipo;

    private LocalDateTime timestamp;

    @NotNull(message = "A latitude é obrigatória.")
    @Min(value = -90, message = "Latitude mínima é -90.")
    @Max(value = 90, message = "Latitude máxima é 90.")
    private Float latitude;

    @NotNull(message = "A longitude é obrigatória.")
    @Min(value = -180, message = "Longitude mínima é -180.")
    @Max(value = 180, message = "Longitude máxima é 180.")
    private Float longitude;

    @NotNull(message = "A precisão é obrigatória.")
    @Min(value = 0, message = "A precisão não pode ser negativa.")
    private Float precisao;

    @NotBlank(message = "A fonte é obrigatória.")
    @Pattern(regexp = "^(WEB|MOBILE_ANDROID|MOBILE_IOS)$", message = "Fonte inválida.")
    private String fonte;

    @NotBlank(message = "O deviceId é obrigatório.")
    private String deviceId;

    private String ip;
}