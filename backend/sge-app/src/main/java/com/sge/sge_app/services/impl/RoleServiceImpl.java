package com.sge.sge_app.services.impl;

import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.repository.RoleRepository;
import com.sge.sge_app.services.RoleService;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Role createRole(String name) {
        Role newRole = new Role();
        newRole.setName(name);
        return roleRepository.save(newRole);
    }

    // Você pode adicionar outros métodos conforme necessário, como findAll, delete, etc.
}
