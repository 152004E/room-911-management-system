package com.room911.controller.auth;

import com.room911.dto.PasswordRecoveryRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/recovery")
@CrossOrigin(origins = "*")
public class PasswordRecoveryController {

    @PostMapping("/request")
    public ResponseEntity<?> requestRecovery(@RequestBody PasswordRecoveryRequest request) {
        // TODO: Implement password recovery logic here (e.g., send email)
        // For now, return a placeholder response
        return ResponseEntity.ok().body("Password recovery requested for: " + request.getIdentifier());
    }
}
