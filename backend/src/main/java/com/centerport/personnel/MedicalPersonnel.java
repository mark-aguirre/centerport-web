package com.centerport.personnel;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Medical personnel entity representing doctors, psychologists, psychometricians,
 * and other licensed medical professionals registered in the system.
 *
 * Each record stores the professional's name, PRC license number, structured
 * {@link PersonnelRole}, optional signature image, and an active flag. The
 * {@code personnelId} is a human-readable business identifier generated
 * server-side (format: {@code PERS} + 8-digit padded number).
 *
 * <p>Deactivation is the soft-delete mechanism: records are never hard-deleted
 * once referenced by reports; {@code active} is flipped to {@code false} instead
 * so historical signatory snapshots on saved reports remain intact while the
 * person is removed from future selection.
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

    /**
     * Free-text specialization retained for backward compatibility and display.
     * The authoritative, machine-readable classification is {@link #role}.
     */
    @Column(name = "specialization")
    private String specialization;

    /**
     * Structured role/category driving module assignment eligibility.
     * Stored as the enum name (upper-snake) via {@link EnumType#STRING}.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 40)
    private PersonnelRole role;

    @Column(name = "title")
    private String title;

    /** URL of the uploaded signature image, if any (nullable). */
    @Column(name = "signature_url")
    private String signatureUrl;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    /** Username of the administrator who created the record. */
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    /** Username of the administrator who last updated the record. */
    @Column(name = "updated_by")
    private String updatedBy;
}
