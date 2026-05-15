package com.room911.controller.auth;

import com.room911.dto.EmployeeAccessRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/employee")
@CrossOrigin(origins = "*")
public class EmployeeAccessController {

    @PostMapping("/access")
    public ResponseEntity<?> requestAccess(@RequestBody EmployeeAccessRequest request) {
        // TODO: Implement actual PIN verification logic here
        // For now, return a placeholder response
        return ResponseEntity.ok().body("Employee access requested with PIN: " + request.getAccessCode());
    }
}
