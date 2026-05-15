package com.room911.dto;

import lombok.Data;

@Data
public class EmployeeAccessRequest {
    private String accessCode; // The 4-digit or numeric PIN code
}
