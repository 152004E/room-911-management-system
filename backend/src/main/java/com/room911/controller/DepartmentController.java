package com.room911.controller;

import com.room911.dto.DepartmentDTO;
import com.room911.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "*") // Permitir llamadas desde el frontend
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAll() {
        return ResponseEntity.ok(departmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getById(@PathVariable Long id) {
        DepartmentDTO department = departmentService.findById(id);
        return department != null ? ResponseEntity.ok(department) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DepartmentDTO> create(@RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.save(departmentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> update(@PathVariable Long id, @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO updated = departmentService.update(id, departmentDTO);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/archived/list")
    public ResponseEntity<List<DepartmentDTO>> getArchived() {
        return ResponseEntity.ok(departmentService.findDeleted());
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        departmentService.restoreById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deletePermanent(@PathVariable Long id) {
        departmentService.deletePermanently(id);
        return ResponseEntity.noContent().build();
    }
}
