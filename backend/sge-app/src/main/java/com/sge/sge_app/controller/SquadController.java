package com.sge.sge_app.controller;

import com.sge.sge_app.dto.request.AddMemberRequest;
import com.sge.sge_app.dto.request.SquadRequest;
import com.sge.sge_app.dto.response.SquadResponse;
import com.sge.sge_app.services.SquadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de Squads
 * 
 * Regras de acesso:
 * - ADMIN: Pode criar, editar, deletar squads e gerenciar membros
 * - USER: Pode apenas visualizar squads
 */
@RestController
@RequestMapping("/api/v1/squads")
@RequiredArgsConstructor
public class SquadController {

    private final SquadService squadService;

    /**
     * Cria um novo squad
     * Apenas ADMIN pode criar squads
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SquadResponse> createSquad(@Valid @RequestBody SquadRequest request) {
        SquadResponse squad = squadService.createSquad(request);
        return new ResponseEntity<>(squad, HttpStatus.CREATED);
    }

    /**
     * Lista todos os squads
     * Acessível por todos os usuários autenticados
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SquadResponse>> getAllSquads() {
        List<SquadResponse> squads = squadService.getAllSquads();
        return ResponseEntity.ok(squads);
    }

    /**
     * Busca um squad por ID
     * Acessível por todos os usuários autenticados
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SquadResponse> getSquadById(@PathVariable Long id) {
        SquadResponse squad = squadService.getSquadById(id);
        return ResponseEntity.ok(squad);
    }

    /**
     * Atualiza um squad
     * Apenas ADMIN pode atualizar squads
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SquadResponse> updateSquad(
            @PathVariable Long id,
            @Valid @RequestBody SquadRequest request) {
        SquadResponse squad = squadService.updateSquad(id, request);
        return ResponseEntity.ok(squad);
    }

    /**
     * Deleta um squad
     * Apenas ADMIN pode deletar squads
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSquad(@PathVariable Long id) {
        squadService.deleteSquad(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Adiciona um membro ao squad
     * Apenas ADMIN pode adicionar membros
     */
    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SquadResponse> addMember(
            @PathVariable Long id,
            @Valid @RequestBody AddMemberRequest request) {
        SquadResponse squad = squadService.addMember(id, request);
        return ResponseEntity.ok(squad);
    }

    /**
     * Remove um membro do squad
     * Apenas ADMIN pode remover membros
     */
    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SquadResponse> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId) {
        SquadResponse squad = squadService.removeMember(id, userId);
        return ResponseEntity.ok(squad);
    }

    /**
     * Busca squads de um usuário específico
     * Acessível por todos os usuários autenticados
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SquadResponse>> getSquadsByUserId(@PathVariable Long userId) {
        List<SquadResponse> squads = squadService.getSquadsByUserId(userId);
        return ResponseEntity.ok(squads);
    }
}
