package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {
    private Long id;
    private String internalId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Boolean isAuthorized;
    private Boolean isActive;
    private Long departmentId;
    private String departmentName;
    private Boolean isSystemAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
