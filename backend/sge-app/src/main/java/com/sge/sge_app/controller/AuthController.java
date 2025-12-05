package com.sge.sge_app.controller;

import com.sge.sge_app.dto.request.LoginRequestDTO;
import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.JwtResponseDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;
import com.sge.sge_app.security.CustomUserDetailsService;
import com.sge.sge_app.security.JwtTokenProvider;
import com.sge.sge_app.services.UserService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserService userService,
                          CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Registra um novo usuário
     * IMPORTANTE: Apenas ADMINs (coordenadores) podem criar novos usuários
     * Endpoint: POST /auth/register
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegisterRequestDTO registerRequest) {
        UserResponseDTO newUser = userService.registerNewUser(registerRequest);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    // ============================================================
    // LOGIN
    // ============================================================
    @PostMapping(
            value = "/login",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<JwtResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        long expiresIn = tokenProvider.getJwtExpirationInMs();

        var roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(
                JwtResponseDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(expiresIn)
                        .roles(roles)
                        .build()
        );
    }

    // ============================================================
    // REFRESH TOKEN
    // ============================================================
    @PostMapping(
            value = "/refresh",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<JwtResponseDTO> refreshAccessToken(@RequestBody JwtResponseDTO refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();

        if (!tokenProvider.validateToken(refreshToken)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        String newAccessToken = tokenProvider.generateAccessToken(authentication);
        String newRefreshToken = tokenProvider.generateRefreshToken(authentication);
        long expiresIn = tokenProvider.getJwtExpirationInMs();

        var roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(
                JwtResponseDTO.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .expiresIn(expiresIn)
                        .roles(roles)
                        .build()
        );
    }

    // ============================================================
    // USUÁRIO LOGADO
    // ============================================================
    @GetMapping(value = "/me", produces = "application/json")
    public ResponseEntity<UserResponseDTO> me(@AuthenticationPrincipal UserDetails principal) {
        var user = userService.findByUsernameOrEmail(principal.getUsername());
        return ResponseEntity.ok(UserResponseDTO.from(user));
    }
}

