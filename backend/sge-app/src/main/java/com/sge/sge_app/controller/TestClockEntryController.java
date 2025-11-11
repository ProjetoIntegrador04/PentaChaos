package com.sge.sge_app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller temporário para testar se o sistema de bater ponto está funcional
 */
@RestController
@RequestMapping("/api/test")
public class TestClockEntryController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Clock Entry System is UP and RUNNING!";
    }

    @GetMapping("/clock-entry-info")
    public String clockEntryInfo() {
        return """
            Sistema de Bater Ponto - Funcionalidades:
            
            POST /api/v1/clockentries - Registrar ponto
            Payload: {
              "tipo": "ENTRY|EXIT|LUNCH_START|LUNCH_END",
              "timestamp": "2024-11-10T08:30:00",
              "latitude": -23.550520,
              "longitude": -46.633308,
              "precisao": 10.5,
              "fonte": "WEB|MOBILE_ANDROID|MOBILE_IOS",
              "deviceId": "device123456"
            }
            
            Melhorias implementadas:
            ✅ Autenticação obrigatória
            ✅ Validações de regras de negócio
            ✅ Geolocalização obrigatória
            ✅ Captura automática de IP
            ✅ Validações de sequência (ENTRY->EXIT)
            ✅ Controle de almoço (LUNCH_START->LUNCH_END)
            """;
    }
}