package com.sge.sge_app.services;

import com.sge.sge_app.models.Card;
import com.sge.sge_app.repository.CardRepository;

import lombok.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço para gerenciamento de cards/tarefas.
 * 
 * Nota: O modelo Card atual possui apenas título, descrição e data de criação.
 * Para uma implementação completa com atribuição de responsáveis,
 * considere usar o modelo Task que possui campos como responsavel, status e prioridade.
 * 
 * Regras de negócio:
 * - ADMIN pode ver todos os cards e criar novos
 * - USER pode ver todos os cards (modelo atual não possui atribuição de responsável)
 */
@Service
public class CardService {

    private final CardRepository repository;

    public CardService(CardRepository repository) {
        this.repository = repository;
    }

    /**
     * Cria um novo card (apenas ADMIN).
     * A data de criação é definida automaticamente pelo modelo.
     */
    public Card criar(@NonNull Card card, Authentication authentication) {
        @SuppressWarnings("null")
        Card result = repository.save(card);
        return result;
    }

    /**
     * Lista todos os cards.
     * Nota: Como o modelo Card atual não possui campo de responsável,
     * todos os usuários autenticados veem todos os cards.
     * Use o endpoint /api/v1/tasks para funcionalidade completa com atribuição.
     */
    public List<Card> listar(Authentication authentication) {
        return repository.findAll();
    }
}
