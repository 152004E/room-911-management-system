package com.room911.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceVerificationRequest {
    private Long employeeId;
    private String imageBase64;
}
