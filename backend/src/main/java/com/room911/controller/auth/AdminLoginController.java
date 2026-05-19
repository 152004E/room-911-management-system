package com.room911.controller.auth;

import com.room911.dto.AdminLoginRequest;
import com.room911.dto.AdminUserDTO;
import com.room911.dto.AuthResponse;
import com.room911.entity.AdminUser;
import com.room911.repository.AdminUserRepository;
import com.room911.security.CustomUserDetailsService;
import com.room911.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/admin")
@CrossOrigin(origins = "*")
public class AdminLoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getIdentifier());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<AdminUserDTO> getCurrentAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token);

            AdminUser admin = adminUserRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            return ResponseEntity.ok(AdminUserDTO.builder()
                    .id(admin.getId())
                    .username(admin.getUsername())
                    .email(admin.getEmail())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
