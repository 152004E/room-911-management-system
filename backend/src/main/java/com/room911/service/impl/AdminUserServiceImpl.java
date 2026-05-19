package com.room911.service.impl;

import com.room911.dto.AdminUserDTO;
import com.room911.entity.AdminUser;
import com.room911.repository.AdminUserRepository;
import com.room911.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public List<AdminUserDTO> findAll() {
        return adminUserRepository.findAllByIsActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminUserDTO findById(Long id) {
        if (id == null) return null;
        return adminUserRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public AdminUserDTO save(AdminUserDTO adminUserDTO) {
        AdminUser adminUser = toEntity(adminUserDTO);
        
        // Generación automática de ID si es un usuario nuevo
        if (adminUser.getId() == null) {
            long count = adminUserRepository.count();
            String nextId = String.format("A%04d", count + 1);
            // Asegurarnos que sea único si hubo borrados
            while (adminUserRepository.findByUsername(nextId).isPresent()) {
                count++;
                nextId = String.format("A%04d", count + 1);
            }
            adminUser.setUsername(nextId);
        }

        // Si tiene password (es creación o actualización de password), lo encriptamos
        if (adminUserDTO.getPassword() != null && !adminUserDTO.getPassword().isEmpty()) {
            adminUser.setPasswordHash(passwordEncoder.encode(adminUserDTO.getPassword()));
        } else if (adminUser.getId() != null) {
            // Si es actualización y no hay password, mantenemos el anterior
            adminUserRepository.findById(adminUser.getId()).ifPresent(old -> {
                adminUser.setPasswordHash(old.getPasswordHash());
            });
        }

        AdminUser saved = adminUserRepository.save(adminUser);
        return toDTO(saved);
    }

    @Override
    public void deleteById(Long id) {
        if (id != null) {
            adminUserRepository.findById(id).ifPresent(adminUser -> {
                adminUser.setIsActive(false);
                adminUserRepository.save(adminUser);
            });
        }
    }

    @Override
    public List<AdminUserDTO> findDeleted() {
        return adminUserRepository.findAllByIsActiveFalse().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void restoreById(Long id) {
        if (id != null) {
            adminUserRepository.findById(id).ifPresent(adminUser -> {
                adminUser.setIsActive(true);
                adminUserRepository.save(adminUser);
            });
        }
    }

    @Override
    public void deletePermanently(Long id) {
        if (id != null) {
            adminUserRepository.deleteById(id);
        }
    }

    private AdminUserDTO toDTO(AdminUser adminUser) {
        return AdminUserDTO.builder()
                .id(adminUser.getId())
                .username(adminUser.getUsername())
                .email(adminUser.getEmail())
                .fullName(adminUser.getFullName())
                .phone(adminUser.getPhone())
                .role(adminUser.getRole())
                .isActive(adminUser.getIsActive())
                .createdAt(adminUser.getCreatedAt())
                .build();
    }

    private AdminUser toEntity(AdminUserDTO dto) {
        return AdminUser.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .role(dto.getRole())
                .isActive(dto.getIsActive())
                .build();
    }
}
