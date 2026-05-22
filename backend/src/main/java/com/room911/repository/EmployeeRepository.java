package com.room911.repository;

import com.room911.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.internalId = :internalId")
    Optional<Employee> findByInternalId(@Param("internalId") String internalId);

    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.id = :id")
    Optional<Employee> findByIdWithDepartment(@Param("id") Long id);

    Optional<Employee> findByEmail(String email);
    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findAllByIsActiveTrue();
    List<Employee> findAllByIsActiveFalse();

    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.isActive = true AND e.adminUser IS NULL")
    List<Employee> findAllActiveNonAdmin();
}
