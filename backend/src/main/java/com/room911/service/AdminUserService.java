package com.room911.service;

import com.room911.dto.AdminUserDTO;
import java.util.List;

public interface AdminUserService {
    List<AdminUserDTO> findAll();
    AdminUserDTO findById(Long id);
    AdminUserDTO save(AdminUserDTO adminUserDTO);
    void deleteById(Long id);
}
