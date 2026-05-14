package com.room911.service;

import com.room911.dto.DepartmentDTO;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO> findAll();
    DepartmentDTO findById(Long id);
    DepartmentDTO save(DepartmentDTO departmentDTO);
    void deleteById(Long id);
}
