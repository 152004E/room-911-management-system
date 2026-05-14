package com.room911.service;

import com.room911.dto.EmployeeDTO;
import java.util.List;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    EmployeeDTO findById(Long id);
    EmployeeDTO save(EmployeeDTO employeeDTO);
    void deleteById(Long id);
    EmployeeDTO findByInternalId(String internalId);
}
