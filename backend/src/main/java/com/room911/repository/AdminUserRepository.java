package com.room911.repository;

import com.room911.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsername(String username);
    java.util.List<AdminUser> findAllByIsActiveTrue();
    java.util.List<AdminUser> findAllByIsActiveFalse();
}
