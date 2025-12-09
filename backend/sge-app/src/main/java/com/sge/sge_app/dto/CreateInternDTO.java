package com.sge.sge_app.dto;

import lombok.Data;

@Data
public class CreateInternDTO {
    private String username;
    private String email;
    private String password;
    private String ra;
    private String squad;
    private String emailPessoal;
}
