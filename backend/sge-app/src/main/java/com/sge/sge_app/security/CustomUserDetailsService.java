package com.sge.sge_app.security;

import com.sge.sge_app.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
// Import adicionado implicitamente pela sua adição
import org.springframework.security.core.userdetails.User; 

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
  
  // --- INÍCIO DA ATUALIZAÇÃO ---
  @Override
  public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    var user = userRepository.findByUsername(usernameOrEmail)
        .or(() -> userRepository.findByEmail(usernameOrEmail))
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));
    
    // Retorna a implementação User do Spring Security
    return new org.springframework.security.core.userdetails.User(
        user.getUsername(), 
        user.getPassword(), 
        user.getAuthorities()
    );
  }
  // --- FIM DA ATUALIZAÇÃO ---
}