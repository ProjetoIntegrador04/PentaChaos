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
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // Busca o usuário no banco de dados pelo username.
    // Se o seu UserEntity implementa UserDetails, você pode retorná-lo diretamente.
    // Se não, você precisaria mapear para um objeto User do Spring Security.
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
  }
}
