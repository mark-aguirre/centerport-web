package com.centerport.personnel;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Medical personnel entity representing doctors, psychologists, psychometricians,
 * and other licensed medical professionals registered in the system.
 *
 * Each record stores the professional's name, PRC license number, and specialization.
 * The {@code personnelId} is a human-readable business identifier generated server-side
 * (format: {@code PERS} + 8-digit padded number).
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see MedicalPersonnelService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "medical_personnel")
public class MedicalPersonnel extends BaseEntity {

    @Column(name = "personnel_id", unique = true)
    private String personnelId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "license_no", nullable = false)
    private String licenseNo;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "title")
    private String title;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
