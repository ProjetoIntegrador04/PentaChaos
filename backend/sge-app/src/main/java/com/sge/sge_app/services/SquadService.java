package com.sge.sge_app.services;

import com.sge.sge_app.domain.model.Squad;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.dto.request.AddMemberRequest;
import com.sge.sge_app.dto.request.SquadRequest;
import com.sge.sge_app.dto.response.SquadResponse;
import com.sge.sge_app.exception.ResourceNotFoundException;
import com.sge.sge_app.repository.SquadRepository;
import com.sge.sge_app.repository.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service para gerenciamento de Squads
 */
@Service
@RequiredArgsConstructor
public class SquadService {

    private final SquadRepository squadRepository;
    private final UserRepository userRepository;

    /**
     * Cria um novo squad (apenas ADMIN)
     */
    @Transactional
    public SquadResponse createSquad(SquadRequest request) {
        // Verifica se já existe um squad com esse nome
        if (squadRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Já existe um squad com o nome: " + request.getName());
        }

        Squad squad = Squad.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        @SuppressWarnings("null")
        Squad savedSquad = squadRepository.save(squad);
        return mapToResponse(savedSquad);
    }

    /**
     * Lista todos os squads
     */
    public List<SquadResponse> getAllSquads() {
        return squadRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Busca um squad por ID
     */
    public SquadResponse getSquadById(@NonNull Long id) {
        Squad squad = squadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Squad não encontrado com ID: " + id));
        return mapToResponse(squad);
    }

    /**
     * Atualiza um squad
     */
    @Transactional
    public SquadResponse updateSquad(@NonNull Long id, SquadRequest request) {
        Squad squad = squadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Squad não encontrado com ID: " + id));

        // Verifica se o novo nome já existe (se for diferente do atual)
        if (!squad.getName().equals(request.getName()) && squadRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Já existe um squad com o nome: " + request.getName());
        }

        squad.setName(request.getName());
        squad.setDescription(request.getDescription());

        Squad updatedSquad = squadRepository.save(squad);
        return mapToResponse(updatedSquad);
    }

    /**
     * Deleta um squad
     */
    @Transactional
    public void deleteSquad(@NonNull Long id) {
        Squad squad = squadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Squad não encontrado com ID: " + id));
        @SuppressWarnings("null")
        Squad result = squad;
        squadRepository.delete(result);
    }

    /**
     * Adiciona um membro ao squad
     */
    @Transactional
    public SquadResponse addMember(@NonNull Long squadId, AddMemberRequest request) {
        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() -> new ResourceNotFoundException("Squad não encontrado com ID: " + squadId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + request.getUserId()));

        squad.addMember(user);
        Squad updatedSquad = squadRepository.save(squad);
        return mapToResponse(updatedSquad);
    }

    /**
     * Remove um membro do squad
     */
    @Transactional
    public SquadResponse removeMember(@NonNull Long squadId, @NonNull Long userId) {
        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() -> new ResourceNotFoundException("Squad não encontrado com ID: " + squadId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + userId));

        squad.removeMember(user);
        Squad updatedSquad = squadRepository.save(squad);
        return mapToResponse(updatedSquad);
    }

    /**
     * Busca squads de um usuário
     */
    public List<SquadResponse> getSquadsByUserId(Long userId) {
        return squadRepository.findSquadsByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Converte Squad para SquadResponse
     */
    private SquadResponse mapToResponse(Squad squad) {
        Set<SquadResponse.UserBasicInfo> members = squad.getMembers().stream()
                .map(user -> SquadResponse.UserBasicInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toSet());

        return SquadResponse.builder()
                .id(squad.getId())
                .name(squad.getName())
                .description(squad.getDescription())
                .memberCount(squad.getMemberCount())
                .members(members)
                .createdAt(squad.getCreatedAt())
                .updatedAt(squad.getUpdatedAt())
                .build();
    }
}
