package com.centerport.employer;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Employer entity representing a manning-agency / employer that seafarers work
 * for. Used to populate the employer selection field on profile and visit
 * registration forms.
 *
 * The {@code employerId} is a human-readable business identifier generated
 * server-side (format: {@code EMPL} + 8-digit padded number).
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see EmployerService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "employers")
public class Employer extends BaseEntity {

    @Column(name = "employer_id", unique = true)
    private String employerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
