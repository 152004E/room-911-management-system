

package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCSVRecord {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Long departmentId;
    private Boolean isAuthorized;
}
