// C:\Users\gabri\OneDrive\Área de Trabalho\PentaChaos\backend\P_I\frequency\src\main\java\projeto_integrador\controller\ClockEntryController.java
package projeto_integrador.controllers; // Ajustado para o seu pacote base

import projeto_integrador.dto.ClockEntryRequest; // Ajustado para o seu pacote DTO
import projeto_integrador.dto.ClockEntryResponse; // Ajustado para o seu pacote DTO
import projeto_integrador.services.ClockEntryService; // Ajustado para o seu pacote Service

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clockentries") // Define o caminho base para os endpoints
public class ClockEntryController {

    private final ClockEntryService clockEntryService;

    @Autowired
    public ClockEntryController(ClockEntryService clockEntryService) {
        this.clockEntryService = clockEntryService;
    }

    /**
     * Endpoint para registrar um novo ponto.
     * Recebe um ClockEntryRequest no corpo da requisição.
     * Retorna o ClockEntryResponse do ponto salvo.
     *
     * @param request O DTO de requisição com os dados do ponto.
     * @param httpServletRequest A requisição HTTP para obter o IP.
     * @return ResponseEntity com o ClockEntryResponse e status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<ClockEntryResponse> registrarPonto(
            @Valid @RequestBody ClockEntryRequest request,
            HttpServletRequest httpServletRequest) {

        // Opcional: preencher o IP da requisição se não vier no DTO do cliente
        if (request.getIp() == null || request.getIp().isEmpty()) {
            String clientIp = httpServletRequest.getRemoteAddr();
            request.setIp(clientIp);
        }

        // Você pode adicionar mais validações ou lógica aqui antes de chamar o serviço.
        // Por exemplo, validar se o tipo de ponto é válido para o usuário, ou se já bateu o ponto de entrada do dia.

        ClockEntryResponse response = clockEntryService.registrarPonto(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED); // Retorna 201 Created
    }

    /**
     * Endpoint para buscar um ponto pelo ID.
     *
     * @param id O ID do ponto a ser buscado.
     * @return ResponseEntity com o ClockEntryResponse e status HTTP 200 (OK).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClockEntryResponse> getClockEntryById(@PathVariable Long id) {
        ClockEntryResponse response = clockEntryService.buscarPontoPorId(id);
        return ResponseEntity.ok(response); // Retorna 200 OK
    }

    // Tratamento de exceções (erro 400 Bad Request para argumentos inválidos)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Você pode adicionar um tratamento de erro mais robusto usando @ControllerAdvice
    // para centralizar a gestão de erros em toda a aplicação.
}