package com.room911.service.impl;

import com.room911.dto.AdminUserDTO;
import com.room911.entity.AdminUser;
import com.room911.entity.Employee;
import com.room911.repository.AdminUserRepository;
import com.room911.repository.EmployeeRepository;
import com.room911.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        AdminUser adminUser;
        
        Long dtoId = adminUserDTO.getId();
        if (dtoId != null) {
            adminUser = adminUserRepository.findById(dtoId)
                    .orElseThrow(() -> new RuntimeException("AdminUser not found with ID: " + dtoId));
            if (adminUserDTO.getRole() != null) {
                adminUser.setRole(adminUserDTO.getRole());
            }
            adminUser.setIsActive(adminUserDTO.getIsActive());
            if (adminUserDTO.getUsername() != null && !adminUserDTO.getUsername().trim().isEmpty()) {
                adminUser.setUsername(adminUserDTO.getUsername());
            }
        } else {
            // Creación
            adminUser = toEntity(adminUserDTO);
            
            // Generación automática de username desde el nombre del empleado
            if (adminUser.getUsername() == null || adminUser.getUsername().trim().isEmpty()) {
                if (adminUser.getEmployee() != null) {
                    String base = generateUsername(adminUser.getEmployee());
                    adminUser.setUsername(base);
                } else {
                    long count = adminUserRepository.count();
                    String nextId = String.format("A%04d", count + 1);
                    while (adminUserRepository.findByUsername(nextId).isPresent()) {
                        count++;
                        nextId = String.format("A%04d", count + 1);
                    }
                    adminUser.setUsername(nextId);
                }
            }
            
            if (adminUser.getRole() == null) {
                adminUser.setRole("ADMIN_ROOM_911");
            }
        }

        // Encriptar password si viene en el DTO
        if (adminUserDTO.getPassword() != null && !adminUserDTO.getPassword().isEmpty()) {
            adminUser.setPasswordHash(passwordEncoder.encode(adminUserDTO.getPassword()));
        } else {
            Long existingId = adminUser.getId();
            if (existingId != null) {
                adminUserRepository.findById(existingId).ifPresent(old -> {
                    adminUser.setPasswordHash(old.getPasswordHash());
                });
            }
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

    private String generateUsername(Employee employee) {
        String raw = (employee.getFirstName() + "." + employee.getLastName())
                .toLowerCase()
                .replaceAll("[^a-z0-9.]", "");
        String username = raw;
        int suffix = 1;
        while (adminUserRepository.findByUsername(username).isPresent()) {
            suffix++;
            username = raw + "." + suffix;
        }
        return username;
    }

    private AdminUserDTO toDTO(AdminUser adminUser) {
        AdminUserDTO.AdminUserDTOBuilder builder = AdminUserDTO.builder()
                .id(adminUser.getId())
                .username(adminUser.getUsername())
                .role(adminUser.getRole())
                .isActive(adminUser.getIsActive())
                .createdAt(adminUser.getCreatedAt());

        if (adminUser.getEmployee() != null) {
            Employee emp = adminUser.getEmployee();
            builder.employeeId(emp.getId())
                   .employeeName(emp.getFirstName() + " " + emp.getLastName())
                   .employeeEmail(emp.getEmail());
        }

        return builder.build();
    }

    private AdminUser toEntity(AdminUserDTO dto) {
        AdminUser.AdminUserBuilder builder = AdminUser.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .role(dto.getRole())
                .isActive(dto.getIsActive());

        Long empId = dto.getEmployeeId();
        if (empId != null) {
            Employee employee = employeeRepository.findById(empId)
                    .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + dto.getEmployeeId()));
            builder.employee(employee);
        }

        return builder.build();
    }
}
