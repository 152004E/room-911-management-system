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

    @Override
    public List<AdminUserDTO> findAll() {
        return adminUserRepository.findAll().stream()
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
        // Nota: El hash del password debería manejarse aquí o en el controller con un encoder
        AdminUser adminUser = toEntity(adminUserDTO);
        @SuppressWarnings("null")
        AdminUser saved = adminUserRepository.save(adminUser);
        return toDTO(saved);
    }

    private AdminUserDTO toDTO(AdminUser adminUser) {
        return AdminUserDTO.builder()
                .id(adminUser.getId())
                .username(adminUser.getUsername())
                .role(adminUser.getRole())
                .isActive(adminUser.getIsActive())
                .createdAt(adminUser.getCreatedAt())
                .build();
    }

    private AdminUser toEntity(AdminUserDTO dto) {
        return AdminUser.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .role(dto.getRole())
                .isActive(dto.getIsActive())
                .build();
    }
}
