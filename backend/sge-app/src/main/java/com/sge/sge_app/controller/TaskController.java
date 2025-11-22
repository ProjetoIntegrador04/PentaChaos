package com.sge.sge_app.controller;

import com.sge.sge_app.dto.request.TaskRequestDTO;
import com.sge.sge_app.dto.response.TaskResponseDTO;
import com.sge.sge_app.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    // --------------------------
    //        CREATE
    // --------------------------
    @PostMapping
    public TaskResponseDTO createTask(@RequestBody TaskRequestDTO dto) {
        return service.createTask(dto);
    }

    // --------------------------
    //         UPDATE
    // --------------------------
    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO dto) {
        return service.updateTask(id, dto);
    }

    // --------------------------
    //     LIST ALL (ADMIN)
    // --------------------------
    @GetMapping
    public List<TaskResponseDTO> listAll() {
        return service.listAll();
    }

    // --------------------------
    //  LISTAR POR RESPONSÁVEL
    //  (Estagiário)
    // --------------------------
    @GetMapping("/user/{id}")
    public List<TaskResponseDTO> listByResponsavel(@PathVariable Long id) {
        return service.listByResponsavel(id);
    }

    // --------------------------
    //   LISTAR POR CRIADOR
    //   (Coordenador)
    // --------------------------
    @GetMapping("/coordinator/{id}")
    public List<TaskResponseDTO> listByCriadoPor(@PathVariable Long id) {
        return service.listByCriadoPor(id);
    }

    // --------------------------
    //         DELETE
    // --------------------------
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
    }
}
