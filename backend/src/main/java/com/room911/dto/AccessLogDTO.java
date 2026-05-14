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
public class AccessLogDTO {
    private Long id;
    private Long employeeId;
    private String employeeFullName;
    private String attemptedInternalId;
    private LocalDateTime accessTimestamp;
    private Boolean isSuccessful;
    private String accessType;
    private String reasonDenied;
}
