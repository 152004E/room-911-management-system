package com.room911.repository;

import com.room911.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    List<AccessLog> findByEmployeeId(Long employeeId);
    List<AccessLog> findByIsSuccessful(Boolean isSuccessful);
}
