package com.room911.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Health Check para verificar que el backend y la BD están activos
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<?> health() {
        boolean dbStatus = checkDatabase();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "ROOM 911 Management System is running");
        response.put("dbStatus", dbStatus ? "CONNECTED" : "DISCONNECTED");
        
        return ResponseEntity.ok(response);
    }

    private boolean checkDatabase() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

