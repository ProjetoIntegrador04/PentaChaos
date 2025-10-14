package com.sge.sge_app.repository;

import com.sge.sge_app.models.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}