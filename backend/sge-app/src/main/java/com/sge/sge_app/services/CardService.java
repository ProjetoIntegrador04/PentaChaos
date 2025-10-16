package com.sge.sge_app.services;

import com.sge.sge_app.models.Card;
import com.sge.sge_app.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {

    private final CardRepository repository;

    public CardService(CardRepository repository) {
        this.repository = repository;
    }

    public Card criar(Card card) {
        return repository.save(card);
    }

    public List<Card> listar() {
        return repository.findAll();
    }
}
