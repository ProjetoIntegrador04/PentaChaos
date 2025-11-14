package com.sge.sge_app.controller;

import com.sge.sge_app.models.Card;
import com.sge.sge_app.services.CardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de cards/tarefas.
 * 
 * Cards são a visualização das tarefas para os estagiários.
 * 
 * Regras de acesso:
 * - ADMIN (Manager): pode criar e visualizar todos os cards
 * - USER (Intern): pode visualizar apenas os cards atribuídos a ele
 */
@RestController
@RequestMapping("/api/v1/cards")
public class CardController {

    private final CardService service;

    public CardController(CardService service) {
        this.service = service;
    }

    /**
     * Cria um novo card.
     * Acesso: Apenas ADMIN (managers).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Card criar(@RequestBody Card card, Authentication authentication) {
        return service.criar(card, authentication);
    }

    /**
     * Lista todos os cards.
     * Acesso: ADMIN vê todos os cards, USER vê apenas seus cards.
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<Card> listar(Authentication authentication) {
        return service.listar(authentication);
    }
}
