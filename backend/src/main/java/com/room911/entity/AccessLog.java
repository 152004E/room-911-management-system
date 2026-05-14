package com.room911.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "access_log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "attempted_internal_id", nullable = false, length = 50)
    private String attemptedInternalId;

    @Column(name = "access_timestamp", nullable = false, updatable = false)
    private LocalDateTime accessTimestamp;

    @Column(name = "is_successful", nullable = false)
    private Boolean isSuccessful;

    @Column(name = "access_type", length = 50)
    private String accessType;

    @Column(name = "reason_denied", columnDefinition = "TEXT")
    private String reasonDenied;

    @PrePersist
    protected void onCreate() {
        accessTimestamp = LocalDateTime.now();
    }
}
