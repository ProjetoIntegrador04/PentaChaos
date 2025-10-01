package com.sge.sge_app.config;

import com.sge.sge_app.security.CustomUserDetailsService;
import com.sge.sge_app.security.JwtAuthenticationEntryPoint;
import com.sge.sge_app.security.JwtAuthenticationFilter;
import com.sge.sge_app.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity // Habilita a segurança web do Spring Security
@EnableMethodSecurity // Habilita segurança baseada em anotações (ex: @PreAuthorize)
public class SecurityConfig {

  private final CustomUserDetailsService customUserDetailsService;
  private final JwtAuthenticationEntryPoint unauthorizedHandler;
  private final JwtTokenProvider tokenProvider;
  private final PasswordEncoder passwordEncoder;

  public SecurityConfig(CustomUserDetailsService customUserDetailsService,
      JwtAuthenticationEntryPoint unauthorizedHandler,
      JwtTokenProvider tokenProvider,
      PasswordEncoder passwordEncoder) {
    this.customUserDetailsService = customUserDetailsService;
    this.unauthorizedHandler = unauthorizedHandler;
    this.tokenProvider = tokenProvider;
    this.passwordEncoder = passwordEncoder;
  }

  // Bean para o filtro de autenticação JWT
  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter(tokenProvider, customUserDetailsService);
  }

  // Configura o provedor de autenticação (DAO Authentication Provider)
  // Ele usará nosso CustomUserDetailsService para carregar os usuários
  // e o PasswordEncoder para verificar as senhas.
  @Bean
  @SuppressWarnings("deprecation")
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(customUserDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder);
    return authProvider;
  }

  // Expor o AuthenticationManager como um Bean para ser usado no AuthController
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
      throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  // Configuração principal da cadeia de filtros de segurança
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // Desabilita CSRF para APIs REST
        .csrf(AbstractHttpConfigurer::disable)
        // Habilita CORS (será configurado via corsConfigurationSource)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // Configura o tratamento de exceções de autenticação
        .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(unauthorizedHandler))
        // Define a política de criação de sessão como STATELESS (sem sessões HTTP)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // Define as regras de autorização para as requisições HTTP
        .authorizeHttpRequests(authorize -> authorize
            .anyRequest().permitAll()); // Permite todas as requisições (ajuste conforme necessário);

    // Adiciona o filtro JWT antes do filtro de autenticação de usuário e senha
    // padrão do Spring Security
    http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    // Adiciona o provedor de autenticação customizado
    http.authenticationProvider(authenticationProvider());

    return http.build();
  }

  // Configuração CORS (Cross-Origin Resource Sharing)
  // Isso é crucial para que seu frontend React possa se comunicar com o backend
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Permitir requisições do seu frontend React
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
    configuration.setAllowCredentials(true); // Permitir envio de credenciais (cookies, headers de autenticação)
    configuration.setExposedHeaders(List.of("Authorization")); // Expor o cabeçalho Authorization para que o cliente
                                                               // possa lê-lo
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Aplica a configuração a todas as rotas
    return source;
  }

  // Ajuste no CustomUserDetailsService para suportar login com username OU email
  // No Card 2.1, o loadUserByUsername busca apenas por username.
  // Vamos ajustar para buscar por username OU email.
  // O ideal é que o CustomUserDetailsService não seja diretamente alterado,
  // mas sim que o loginRequest.getUsernameOrEmail() seja tratado.
  // PORÉM, para simplificar, faremos aqui uma pequena adaptação temporária,
  // ou você pode ter um método de busca "findUserByUsernameOrEmail" no
  // UserRepository.
  // Para este Card, vamos supor que o CustomUserDetailsService aceita o
  // usernameOrEmail
  // e tenta buscar por username primeiro, depois por email se não encontrar.
  // (Isso será o próximo passo antes da verificação)
}