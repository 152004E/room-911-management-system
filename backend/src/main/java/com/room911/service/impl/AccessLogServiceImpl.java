package com.room911.service.impl;

import com.room911.dto.AccessLogDTO;
import com.room911.entity.AccessLog;
import com.room911.entity.Employee;
import com.room911.repository.AccessLogRepository;
import com.room911.repository.EmployeeRepository;
import com.room911.service.AccessLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccessLogServiceImpl implements AccessLogService {

    @Autowired
    private AccessLogRepository accessLogRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<AccessLogDTO> findAll() {
        return accessLogRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccessLogDTO save(AccessLogDTO accessLogDTO) {
        AccessLog accessLog = toEntity(accessLogDTO);
        Long employeeId = accessLogDTO.getEmployeeId();
        if (employeeId != null) {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElse(null);
            accessLog.setEmployee(employee);
        }
        @SuppressWarnings("null")
        AccessLog saved = accessLogRepository.save(accessLog);
        return toDTO(saved);
    }

    @Override
    public List<AccessLogDTO> findByEmployeeId(Long employeeId) {
        if (employeeId == null) return List.of();
        return accessLogRepository.findByEmployeeId(employeeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AccessLogDTO toDTO(AccessLog log) {
        String fullName = "Desconocido";
        if (log.getEmployee() != null) {
            fullName = log.getEmployee().getFirstName() + " " + log.getEmployee().getLastName();
        }
        
        return AccessLogDTO.builder()
                .id(log.getId())
                .employeeId(log.getEmployee() != null ? log.getEmployee().getId() : null)
                .employeeFullName(fullName)
                .attemptedInternalId(log.getAttemptedInternalId())
                .accessTimestamp(log.getAccessTimestamp())
                .isSuccessful(log.getIsSuccessful())
                .accessType(log.getAccessType())
                .reasonDenied(log.getReasonDenied())
                .build();
    }

    private AccessLog toEntity(AccessLogDTO dto) {
        return AccessLog.builder()
                .id(dto.getId())
                .attemptedInternalId(dto.getAttemptedInternalId())
                .isSuccessful(dto.getIsSuccessful())
                .accessType(dto.getAccessType())
                .reasonDenied(dto.getReasonDenied())
                .build();
    }
}
