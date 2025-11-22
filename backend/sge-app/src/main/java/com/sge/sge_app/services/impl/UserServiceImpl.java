package com.sge.sge_app.services.impl;

import com.sge.sge_app.dto.request.UserRegisterRequestDTO;
import com.sge.sge_app.dto.response.UserResponseDTO;
import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.domain.model.User;
import com.sge.sge_app.exception.ResourceAlreadyExistsException;
import com.sge.sge_app.repository.UserRepository;
import com.sge.sge_app.services.RoleService;
import com.sge.sge_app.services.UserService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final RoleService roleService;
  private final PasswordEncoder passwordEncoder;
  private final ModelMapper modelMapper;

  public UserServiceImpl(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder,
      ModelMapper modelMapper) {
    this.userRepository = userRepository;
    this.roleService = roleService;
    this.passwordEncoder = passwordEncoder;
    this.modelMapper = modelMapper;

    // Configuração do ModelMapper para User para UserResponseDTO
    // Isso garante que as roles sejam mapeadas para um Set<String> de nomes
    modelMapper.createTypeMap(User.class, UserResponseDTO.class)
        .addMappings(mapper -> mapper.map(
            src -> (src.getRoles() != null ? src.getRoles().stream() : Stream.<Role>empty())
                .map(Role::getName)
                .collect(Collectors.toSet()),
            UserResponseDTO::setRoles));

  }

  @Override
  public UserResponseDTO registerNewUser(UserRegisterRequestDTO request) {

    System.out.println("Attempting to register user: " + request.getUsername() + ", " + request.getEmail());
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new ResourceAlreadyExistsException("Usuário com este username já existe.");
    }
    System.out.println("lInha: 57 Username is available.");
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ResourceAlreadyExistsException("Usuário com este e-mail já existe.");
    }
    System.out.println("Email is available.");
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword())); // Hashea a senha
    user.setEnabled(true); // Novo usuário por padrão está habilitado
    
    // Campos adicionais (opcionais)
    user.setFullName(request.getFullName());
    user.setRa(request.getRa());
    user.setSquad(request.getSquad());
    user.setPhoneNumber(request.getPhoneNumber());

    Set<Role> roles = new HashSet<>();
    
    // Adiciona o papel padrão "ROLE_USER" para todos
    Role userRole = roleService.findByName("ROLE_USER")
        .orElseGet(() -> roleService.createRole("ROLE_USER"));
    roles.add(userRole);
    
    // Se o campo isAdmin for true, adiciona ROLE_ADMIN
    if (request.getIsAdmin() != null && request.getIsAdmin()) {
        Role adminRole = roleService.findByName("ROLE_ADMIN")
            .orElseGet(() -> roleService.createRole("ROLE_ADMIN"));
        roles.add(adminRole);
        System.out.println("User will be created with ADMIN role");
    }
    
    user.setRoles(roles);

    System.out.println("Saving user: " + user.getUsername() + ", " + user.getEmail());
    User savedUser = userRepository.save(user);
    System.out.println("User registered successfully with ID: " + savedUser.getId());
    return modelMapper.map(savedUser, UserResponseDTO.class);
  }

  @Override
  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public UserResponseDTO findUserResponseById(Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
    return modelMapper.map(user, UserResponseDTO.class);
  }

  @Override
  public List<UserResponseDTO> findAllUsers() {
    return userRepository.findAll().stream()
        .map(user -> modelMapper.map(user, UserResponseDTO.class))
        .collect(Collectors.toList());
  }
  // Outros métodos para atualizar, deletar, etc. virão em cards futuros
}