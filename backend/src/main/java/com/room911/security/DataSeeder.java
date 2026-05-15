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
        AdminUser admin = adminUserRepository.findByUsername("admin").orElse(new AdminUser());
        
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN_ROOM_911");
        admin.setIsActive(true);
        
        adminUserRepository.save(admin);
        System.out.println(">>> SECURITY SYSTEM: Admin user 'admin' has been synchronized with password 'admin123'");
    }
}
