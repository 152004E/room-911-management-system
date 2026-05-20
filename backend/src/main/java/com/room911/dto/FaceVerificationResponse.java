package com.room911.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceVerificationResponse {
    private boolean match;
    private double confidence;
    private String message;
}
