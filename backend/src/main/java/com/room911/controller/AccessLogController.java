package com.room911.controller;

import com.room911.dto.AccessLogDTO;
import com.room911.service.AccessLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/access-logs")
@CrossOrigin(origins = "*")
public class AccessLogController {

    @Autowired
    private AccessLogService accessLogService;

    @GetMapping
    public ResponseEntity<List<AccessLogDTO>> getAll() {
        return ResponseEntity.ok(accessLogService.findAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AccessLogDTO>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(accessLogService.findByEmployeeId(employeeId));
    }

    @PostMapping
    public ResponseEntity<AccessLogDTO> logAccess(@RequestBody AccessLogDTO accessLogDTO) {
        return ResponseEntity.ok(accessLogService.save(accessLogDTO));
    }
}
