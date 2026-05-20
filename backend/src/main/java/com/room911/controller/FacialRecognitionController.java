package com.room911.controller;

import com.room911.dto.FaceRegistrationRequest;
import com.room911.dto.FaceVerificationRequest;
import com.room911.dto.FaceVerificationResponse;
import com.room911.entity.AccessLog;
import com.room911.entity.Employee;
import com.room911.repository.AccessLogRepository;
import com.room911.repository.EmployeeRepository;
import com.room911.service.FacialRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class FacialRecognitionController {

    @Autowired
    private FacialRecognitionService facialRecognitionService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AccessLogRepository accessLogRepository;

    @PostMapping("/auth/employee/verify-face")
    public ResponseEntity<?> verifyFace(@RequestBody FaceVerificationRequest request) {
        if (request.getEmployeeId() == null || request.getImageBase64() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "employeeId and imageBase64 required"));
        }

        Optional<Employee> employeeOpt = employeeRepository.findById(request.getEmployeeId());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Employee not found"));
        }

        Employee employee = employeeOpt.get();
        FaceVerificationResponse result = facialRecognitionService.verifyFace(
            request.getEmployeeId(),
            request.getImageBase64()
        );

        AccessLog log = new AccessLog();
        log.setEmployee(employee);
        log.setAttemptedInternalId(employee.getInternalId());
        log.setIsSuccessful(result.isMatch());
        log.setAccessType(result.isMatch() ? "BIOMETRIC_SUCCESS" : "BIOMETRIC_FAILURE");
        if (!result.isMatch()) {
            log.setReasonDenied("Face does not match (confidence: " + String.format("%.2f", result.getConfidence()) + ")");
        }
        accessLogRepository.save(log);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/employees/{id}/register-face")
    public ResponseEntity<?> registerFace(
            @PathVariable Long id,
            @RequestBody FaceRegistrationRequest request) {
        if (request.getImageBase64() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "imageBase64 required"));
        }

        if (employeeRepository.findById(id).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Employee not found"));
        }

        String error = facialRecognitionService.registerFace(id, request.getImageBase64());
        if (error == null) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Face registered successfully"));
        } else {
            return ResponseEntity.status(422).body(Map.of("success", false, "message", error));
        }
    }

    @GetMapping("/employees/{id}/face-status")
    public ResponseEntity<?> getFaceStatus(@PathVariable Long id) {
        boolean registered = facialRecognitionService.hasFace(id);
        return ResponseEntity.ok(Map.of("employeeId", id, "registered", registered));
    }

    @DeleteMapping("/employees/{id}/face")
    public ResponseEntity<?> deleteFace(@PathVariable Long id) {
        facialRecognitionService.deleteFace(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Face deleted"));
    }
}
