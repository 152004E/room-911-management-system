package com.room911.repository;

import com.room911.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByInternalId(String internalId);
    Optional<Employee> findByEmail(String email);
    List<Employee> findByDepartmentId(Long departmentId);
}
