package com.room911.service;

import com.room911.dto.AccessLogDTO;
import java.util.List;

public interface AccessLogService {
    List<AccessLogDTO> findAll();
    AccessLogDTO save(AccessLogDTO accessLogDTO);
    List<AccessLogDTO> findByEmployeeId(Long employeeId);
}
