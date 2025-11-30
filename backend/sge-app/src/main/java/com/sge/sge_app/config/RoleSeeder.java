package com.sge.sge_app.config;

import com.sge.sge_app.domain.model.Role;
import com.sge.sge_app.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {
  private final RoleRepository roleRepo;

  @Override
  public void run(String... args) {
    Stream.of("ROLE_COORDINATOR", "ROLE_INTERN").forEach(rn ->
      roleRepo.findByName(rn).orElseGet(() -> roleRepo.save(Role.builder().name(rn).build()))
    );
  }
}
