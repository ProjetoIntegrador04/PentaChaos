package com.sge.sge_app.services;

import com.sge.sge_app.repository.ClockEntryRepository;
import com.sge.sge_app.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ClockEntryServiceSimpleTest {

    @Mock
    private ClockEntryRepository clockEntryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClockEntryService clockEntryService;

    @Test
    @DisplayName("Deve verificar se o service foi criado corretamente")
    void testServiceNotNull() {
        // Then
        assertNotNull(clockEntryService);
    }

    @Test
    @DisplayName("Deve verificar se os repositórios foram injetados")
    void testRepositoriesInjected() {
        // Then
        assertNotNull(clockEntryRepository);
        assertNotNull(userRepository);
    }
}