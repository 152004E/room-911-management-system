package com.room911.service.impl;

import com.room911.dto.EmployeeCSVRecord;
import com.room911.dto.EmployeeDTO;
import com.room911.entity.Department;
import com.room911.entity.Employee;
import com.room911.repository.DepartmentRepository;
import com.room911.repository.EmployeeRepository;
import com.room911.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        Employee employee;

        // Si es actualización, merge con los datos existentes
        if (employeeDTO.getId() != null) {
            employee = employeeRepository.findById(employeeDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            // Actualizar solo los campos que pueden cambiar
            employee.setFirstName(employeeDTO.getFirstName());
            employee.setLastName(employeeDTO.getLastName());
            employee.setEmail(employeeDTO.getEmail());
            employee.setPhoneNumber(employeeDTO.getPhoneNumber());
            employee.setIsAuthorized(employeeDTO.getIsAuthorized());
            // Preservar isActive (no sobreescribir con null)
        } else {
            // Es un nuevo empleado
            employee = toEntity(employeeDTO);
            long count = employeeRepository.count();
            String nextId = String.format("%04d", count + 1);
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

        // Refetch with department eagerly loaded to avoid lazy-loading issues
        Employee refreshed = employeeRepository.findByIdWithDepartment(saved.getId())
                .orElse(saved);
        return toDTO(refreshed);
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

    @Override
    public Map<String, Object> importFromCSV(List<EmployeeCSVRecord> records) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int errorCount = 0;
        List<String> errors = new java.util.ArrayList<>();

        for (int i = 0; i < records.size(); i++) {
            try {
                EmployeeCSVRecord record = records.get(i);

                // Validate required fields
                if (record.getFirstName() == null || record.getFirstName().trim().isEmpty()) {
                    errors.add("Row " + (i + 2) + ": First name is required");
                    errorCount++;
                    continue;
                }
                if (record.getLastName() == null || record.getLastName().trim().isEmpty()) {
                    errors.add("Row " + (i + 2) + ": Last name is required");
                    errorCount++;
                    continue;
                }
                if (record.getEmail() == null || record.getEmail().trim().isEmpty()) {
                    errors.add("Row " + (i + 2) + ": Email is required");
                    errorCount++;
                    continue;
                }
                if (record.getDepartmentId() == null) {
                    errors.add("Row " + (i + 2) + ": Department ID is required");
                    errorCount++;
                    continue;
                }

                // Check if email already exists
                if (employeeRepository.findByEmail(record.getEmail()).isPresent()) {
                    errors.add("Row " + (i + 2) + ": Email '" + record.getEmail() + "' already exists");
                    errorCount++;
                    continue;
                }

                // Check department exists
                Department dept = departmentRepository.findById(record.getDepartmentId())
                        .orElse(null);
                if (dept == null) {
                    errors.add("Row " + (i + 2) + ": Department ID " + record.getDepartmentId() + " not found");
                    errorCount++;
                    continue;
                }

                // Create employee
                Employee employee = new Employee();
                employee.setFirstName(record.getFirstName());
                employee.setLastName(record.getLastName());
                employee.setEmail(record.getEmail());
                employee.setPhoneNumber(record.getPhoneNumber());
                employee.setIsAuthorized(record.getIsAuthorized() != null ? record.getIsAuthorized() : true);
                employee.setIsActive(true);
                employee.setDepartment(dept);

                // Generate unique internal ID
                long count = employeeRepository.count();
                String nextId = String.format("%04d", count + 1);
                while (employeeRepository.findByInternalId(nextId).isPresent()) {
                    count++;
                    nextId = String.format("%04d", count + 1);
                }
                employee.setInternalId(nextId);

                employeeRepository.save(employee);
                successCount++;
            } catch (Exception e) {
                errors.add("Row " + (i + 2) + ": " + e.getMessage());
                errorCount++;
            }
        }

        result.put("successCount", successCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors);
        return result;
    }
}
