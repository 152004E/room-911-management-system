package com.room911.service.impl;

import com.room911.dto.DepartmentDTO;
import com.room911.entity.Department;
import com.room911.repository.DepartmentRepository;
import com.room911.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<DepartmentDTO> findAll() {
        return departmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDTO findById(Long id) {
        if (id == null) return null;
        return departmentRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public DepartmentDTO save(DepartmentDTO departmentDTO) {
        Department department = toEntity(departmentDTO);
        @SuppressWarnings("null")
        Department saved = departmentRepository.save(department);
        return toDTO(saved);
    }

    @Override
    public void deleteById(Long id) {
        if (id != null) {
            departmentRepository.deleteById(id);
        }
    }

    private DepartmentDTO toDTO(Department department) {
        return DepartmentDTO.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .createdAt(department.getCreatedAt())
                .build();
    }

    private Department toEntity(DepartmentDTO dto) {
        return Department.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }
}
