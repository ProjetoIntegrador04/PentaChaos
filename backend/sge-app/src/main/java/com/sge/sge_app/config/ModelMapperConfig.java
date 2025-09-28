package com.sge.sge_app.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();
    // Aqui você pode adicionar configurações específicas para o ModelMapper
    // Ex: Definir mapeamentos personalizados se os nomes dos campos forem
    // diferentes
    // modelMapper.createTypeMap(User.class, UserResponseDTO.class)
    // .addMapping(src ->
    // src.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
    // UserResponseDTO::setRoles);
    return modelMapper;
  }
}