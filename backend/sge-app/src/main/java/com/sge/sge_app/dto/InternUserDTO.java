package com.sge.sge_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InternUserDTO {
    private Long id;
    private String username;
    private String email;
    private String emailPessoal;
    private String ra;
    private String squad;
    private boolean enabled;
    private List<String> roles;
}
