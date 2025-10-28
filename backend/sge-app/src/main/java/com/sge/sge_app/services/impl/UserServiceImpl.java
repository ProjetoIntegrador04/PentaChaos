package com.sge.sge_app.services.impl;

import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;
import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.exception.ResourceAlreadyExistsException;
import com.sge.sge_app.repository.UserRepository;
import com.sge.sge_app.services.RoleService;
import com.sge.sge_app.services.UserService;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository userRepository,
                           RoleService roleService,
                           PasswordEncoder passwordEncoder,
                           ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;

        // Mapeia User -> UserResponseDTO convertendo Set<Role> -> Set<String>
        modelMapper.createTypeMap(User.class, UserResponseDTO.class)
            .addMappings(mapper -> mapper.map(
                src -> (src.getRoles() != null ? src.getRoles().stream() : Stream.<Role>empty())
                        .map(Role::getName)
                        .collect(Collectors.toSet()),
                UserResponseDTO::setRoles
            ));
    }

    @Override
    public UserResponseDTO registerNewUser(UserRegisterRequestDTO request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Usuário com este username já existe.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Usuário com este e-mail já existe.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        // Papéis
        Set<Role> roles = new HashSet<>();

        // Papel base (se quiser manter sempre):
        Role userRole = roleService.findByName("ROLE_USER")
                .orElseGet(() -> roleService.createRole("ROLE_USER"));
        roles.add(userRole);

        // Normaliza o que veio do request (pode ser null)
        String requestedRole = (request.getRole() == null || request.getRole().isBlank())
                ? "ROLE_INTERN"                              // padrão se não enviar
                : request.getRole().trim().toUpperCase();    // ex.: ROLE_COORDINATOR

        // Apenas permitimos dois perfis de acesso além do ROLE_USER
        switch (requestedRole) {
            case "ROLE_COORDINATOR" -> {
                Role coord = roleService.findByName("ROLE_COORDINATOR")
                        .orElseThrow(() -> new IllegalStateException("Role 'ROLE_COORDINATOR' não encontrada."));
                roles.add(coord);
            }
            case "ROLE_INTERN" -> {
                Role intern = roleService.findByName("ROLE_INTERN")
                        .orElseThrow(() -> new IllegalStateException("Role 'ROLE_INTERN' não encontrada."));
                roles.add(intern);
            }
            default -> throw new IllegalArgumentException("Role inválida: " + requestedRole);
        }

        user.setRoles(roles);

        User saved = userRepository.save(user);
        return modelMapper.map(saved, UserResponseDTO.class);
    }

    @Override
    public java.util.Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public java.util.Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + usernameOrEmail));
    }

    @Override
    public UserResponseDTO findUserResponseById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    public List<UserResponseDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> modelMapper.map(u, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
}
