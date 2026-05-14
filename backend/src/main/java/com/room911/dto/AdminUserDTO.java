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
public class AdminUserDTO {
    private Long id;
    private String username;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
