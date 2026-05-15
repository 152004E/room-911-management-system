package com.room911.dto;

import lombok.Data;

@Data
public class PasswordRecoveryRequest {
    private String identifier; // The email or username of the account to recover
}
