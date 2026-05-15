package com.room911.security;

import com.room911.entity.AdminUser;
import com.room911.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    // Password is "admin123"
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("SUPERADMIN")
                    .isActive(true)
                    .build();
            AdminUser saved = adminUserRepository.save(admin);
            if (saved != null) {
                System.out.println("Default admin user created: admin / admin123");
            }
        }
    }
}
