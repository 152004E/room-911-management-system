package com.room911.service.impl;

import com.room911.dto.EmployeeDTO;
import com.room911.entity.Department;
import com.room911.entity.Employee;
import com.room911.repository.DepartmentRepository;
import com.room911.repository.EmployeeRepository;
import com.room911.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<EmployeeDTO> findAll() {
        return employeeRepository.findAllByIsActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO findById(Long id) {
        if (id == null) return null;
        return employeeRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public EmployeeDTO save(EmployeeDTO employeeDTO) {
        Employee employee = toEntity(employeeDTO);
        
        // Generación automática de Internal ID si es nuevo
        if (employee.getId() == null) {
            long count = employeeRepository.count();
            String nextId = String.format("%04d", count + 1);
            // Asegurarnos que sea único
            while (employeeRepository.findByInternalId(nextId).isPresent()) {
                count++;
                nextId = String.format("%04d", count + 1);
            }
            employee.setInternalId(nextId);
        }
        
        Long departmentId = employeeDTO.getDepartmentId();
        if (departmentId == null) {
            throw new RuntimeException("Department ID is required");
        }
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        employee.setDepartment(department);
        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }

    @Override
    public void deleteById(Long id) {
        if (id != null) {
            employeeRepository.findById(id).ifPresent(employee -> {
                employee.setIsActive(false);
                employeeRepository.save(employee);
            });
        }
    }

    @Override
    public List<EmployeeDTO> findDeleted() {
        return employeeRepository.findAllByIsActiveFalse().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void restoreById(Long id) {
        if (id != null) {
            employeeRepository.findById(id).ifPresent(employee -> {
                employee.setIsActive(true);
                employeeRepository.save(employee);
            });
        }
    }

    @Override
    public void deletePermanently(Long id) {
        if (id != null) {
            employeeRepository.deleteById(id);
        }
    }

    @Override
    public EmployeeDTO findByInternalId(String internalId) {
        return employeeRepository.findByInternalId(internalId)
                .map(this::toDTO)
                .orElse(null);
    }

    private EmployeeDTO toDTO(Employee employee) {
        return EmployeeDTO.builder()
                .id(employee.getId())
                .internalId(employee.getInternalId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .phoneNumber(employee.getPhoneNumber())
                .isAuthorized(employee.getIsAuthorized())
                .isActive(employee.getIsActive())
                .departmentId(employee.getDepartment().getId())
                .departmentName(employee.getDepartment().getName())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    private Employee toEntity(EmployeeDTO dto) {
        return Employee.builder()
                .id(dto.getId())
                .internalId(dto.getInternalId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .isAuthorized(dto.getIsAuthorized())
                .build();
    }
}
