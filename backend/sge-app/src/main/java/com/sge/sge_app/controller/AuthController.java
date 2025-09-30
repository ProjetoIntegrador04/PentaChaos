package com.sge.sge_app.controller;

import com.sge.sge_app.dto.request.LoginRequestDTO;
import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.JwtResponseDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;
import com.sge.sge_app.security.JwtTokenProvider;
import com.sge.sge_app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService; // Usado para registro e carregamento de UserDetails

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegisterRequestDTO registerRequest) {
        UserResponseDTO newUser = userService.registerNewUser(registerRequest);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        // Autentica o usuário usando o AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(), // Usaremos este campo para username/email no UserDetailsService
                        loginRequest.getPassword()
                )
        );

        // Define a autenticação no contexto de segurança do Spring
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Gera os tokens JWT
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        long expiresIn = tokenProvider.getJwtExpirationInMs();

        return ResponseEntity.ok(
                JwtResponseDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(expiresIn)
                        .build()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponseDTO> refreshAccessToken(@RequestBody JwtResponseDTO refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();

        if (tokenProvider.validateToken(refreshToken)) {
            String username = tokenProvider.getUsernameFromToken(refreshToken);
            // Para gerar um novo Access Token, precisamos reautenticar o usuário
            // Carregamos os detalhes do usuário, criamos uma autenticação 'dummy' para gerar o token
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userService.findByUsername(username).orElseThrow(() -> new RuntimeException("Usuário não encontrado para refresh token")),
                    null, // Senha não é necessária para refresh token
                    userService.findByUsername(username).get().getAuthorities() // Carrega as autoridades do usuário
            );

            String newAccessToken = tokenProvider.generateAccessToken(authentication);
            // Opcional: Gerar um novo refresh token também, ou manter o mesmo até expirar
            String newRefreshToken = tokenProvider.generateRefreshToken(authentication); // Gerando um novo refresh token
            long expiresIn = tokenProvider.getJwtExpirationInMs();

            return ResponseEntity.ok(
                    JwtResponseDTO.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(newRefreshToken) // Retorna o novo refresh token
                            .expiresIn(expiresIn)
                            .build()
            );
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Refresh token inválido ou expirado
        }
    }
}
