package com.room911.controller.auth;

import com.room911.dto.EmployeeAccessRequest;
import com.room911.entity.AccessLog;
import com.room911.entity.Employee;
import com.room911.repository.AccessLogRepository;
import com.room911.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth/employee")
@CrossOrigin(origins = "*")
public class EmployeeAccessController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AccessLogRepository accessLogRepository;

    @PostMapping("/access")
    public ResponseEntity<?> requestAccess(@RequestBody EmployeeAccessRequest request) {
        String code = request.getInternalId();
        if (code == null || code.isEmpty()) {
            code = request.getAccessCode();
        }

        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Código de identificación requerido"));
        }

        Optional<Employee> employeeOpt = employeeRepository.findByInternalId(code);
        
        boolean authorized = employeeOpt.isPresent() && employeeOpt.get().getIsAuthorized();
        
        // Crear log
        AccessLog log = new AccessLog();
        log.setAttemptedInternalId(code);
        log.setIsSuccessful(authorized);
        log.setAccessType("TERMINAL_PIN");
        
        if (employeeOpt.isPresent()) {
            log.setEmployee(employeeOpt.get());
            if (!authorized) {
                log.setReasonDenied("Empleado no autorizado para acceso");
            }
        } else {
            log.setReasonDenied("Código de empleado no encontrado");
        }

        accessLogRepository.save(log);

        if (authorized) {
            Employee emp = employeeOpt.get();
            String deptName = emp.getDepartment() != null ? emp.getDepartment().getName() : "Unknown";
            return ResponseEntity.ok(Map.of(
                "authorized", true,
                "message", "Acceso Concedido",
                "employee", Map.of(
                    "id", emp.getId(),
                    "firstName", emp.getFirstName(),
                    "lastName", emp.getLastName(),
                    "departmentName", deptName
                )
            ));
        } else {
            String msg = employeeOpt.isPresent() 
                ? "El usuario existe pero no tiene permisos" 
                : "Usuario no encontrado";
            
            return ResponseEntity.status(403).body(Map.of(
                "authorized", false,
                "message", msg
            ));
        }
    }
}
