package com.room911.security;

import com.room911.entity.AdminUser;
import com.room911.entity.Department;
import com.room911.entity.Employee;
import com.room911.repository.AdminUserRepository;
import com.room911.repository.DepartmentRepository;
import com.room911.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("null")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Asegurar que exista un departamento administrativo por defecto
        Department adminDept = departmentRepository.findByName("Administración")
                .orElseGet(() -> {
                    Department dept = Department.builder()
                            .name("Administración")
                            .description("Control y gestión administrativa")
                            .isActive(true)
                            .build();
                    return departmentRepository.save(dept);
                });

        // Asegurar que exista un empleado para el administrador principal
        Employee adminEmployee = employeeRepository.findByEmail("admin@room911.com")
                .orElseGet(() -> {
                    Employee emp = Employee.builder()
                            .firstName("Admin")
                            .lastName("Sistema")
                            .email("admin@room911.com")
                            .phoneNumber("555-0199")
                            .internalId("A0000")
                            .isAuthorized(true)
                            .isActive(true)
                            .department(adminDept)
                            .build();
                    return employeeRepository.save(emp);
                });

        // Crear el admin por defecto solo si NO existe
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("ADMIN_ROOM_911")
                    .isActive(true)
                    .employee(adminEmployee)
                    .build();
            adminUserRepository.save(admin);
            System.out.println(">>> SECURITY SYSTEM: Admin user 'admin' created with password 'admin123'");
        }
    }
}
