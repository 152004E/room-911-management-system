package com.room911.dto;

import lombok.Data;

@Data
public class AdminLoginRequest {
    private String identifier; // can be username or email
    private String password;
}
