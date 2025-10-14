package com.sge.sge_app.controller;

import com.sge.sge_app.models.Card;
import com.sge.sge_app.services.CardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
public class CardController {

    private final CardService service;

    public CardController(CardService service) {
        this.service = service;
    }

    @PostMapping
    public Card criar(@RequestBody Card card) {
        return service.criar(card);
    }

    @GetMapping
    public List<Card> listar() {
        return service.listar();
    }
}
