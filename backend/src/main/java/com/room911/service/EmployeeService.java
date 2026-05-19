package com.room911.service;

import com.room911.dto.EmployeeCSVRecord;
import com.room911.dto.EmployeeDTO;
import java.util.List;
import java.util.Map;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    EmployeeDTO findById(Long id);
    EmployeeDTO save(EmployeeDTO employeeDTO);
    void deleteById(Long id);
    EmployeeDTO findByInternalId(String internalId);
    List<EmployeeDTO> findDeleted();
    void restoreById(Long id);
    void deletePermanently(Long id);
    Map<String, Object> importFromCSV(List<EmployeeCSVRecord> records);
}
