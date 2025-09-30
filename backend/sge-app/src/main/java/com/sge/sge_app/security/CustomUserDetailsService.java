package com.sge.sge_app.security;

import com.sge.sge_app.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Esta anotação indica que é um componente de serviço e que o Spring deve gerenciar seu ciclo de vida.
@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  // Injeção de dependência do UserRepository via construtor
  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // Método principal da interface UserDetailsService.
  // Ele é chamado pelo Spring Security quando tenta autenticar um usuário.
  @Override
  public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
    // Tenta buscar pelo username
    return userRepository.findByUsername(identifier)
        // Se não encontrar, tenta buscar pelo email
        .or(() -> userRepository.findByEmail(identifier))
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + identifier));
  }
}
