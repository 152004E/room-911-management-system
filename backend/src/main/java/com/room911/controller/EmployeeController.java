package com.room911.controller;

import com.room911.dto.EmployeeDTO;
import com.room911.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(employeeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getById(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.findById(id);
        return employee != null ? ResponseEntity.ok(employee) : ResponseEntity.notFound().build();
    }

    @GetMapping("/internal/{internalId}")
    public ResponseEntity<EmployeeDTO> getByInternalId(@PathVariable String internalId) {
        EmployeeDTO employee = employeeService.findByInternalId(internalId);
        return employee != null ? ResponseEntity.ok(employee) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.save(employeeDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        employeeDTO.setId(id);
        return ResponseEntity.ok(employeeService.save(employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/archived/list")
    public ResponseEntity<List<EmployeeDTO>> getArchived() {
        return ResponseEntity.ok(employeeService.findDeleted());
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        employeeService.restoreById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deletePermanent(@PathVariable Long id) {
        employeeService.deletePermanently(id);
        return ResponseEntity.noContent().build();
    }
}
