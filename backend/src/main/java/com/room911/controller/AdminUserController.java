package com.room911.controller;

import com.room911.dto.AdminUserDTO;
import com.room911.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admins")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAll() {
        return ResponseEntity.ok(adminUserService.findAll());
    }

    @PostMapping
    public ResponseEntity<AdminUserDTO> create(@RequestBody AdminUserDTO adminUserDTO) {
        return ResponseEntity.ok(adminUserService.save(adminUserDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminUserDTO> update(@PathVariable Long id, @RequestBody AdminUserDTO adminUserDTO) {
        adminUserDTO.setId(id);
        return ResponseEntity.ok(adminUserService.save(adminUserDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminUserService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
