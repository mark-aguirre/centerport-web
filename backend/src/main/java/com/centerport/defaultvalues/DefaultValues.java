package com.centerport.defaultvalues;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Default Values entity — a named set of laboratory (hematology) reference /
 * "normal value" strings used to pre-fill a Laboratory Report (Hematology).
 *
 * This is a configuration/settings record maintained by Laboratory staff, not
 * per-patient data: there is no seafarer profile link. Each row is one named
 * set of default values. Range values such as {@code "11-17"} or
 * {@code "150,000-450,000"} are stored verbatim as free text.
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see DefaultValuesService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "hematology_default_values")
public class DefaultValues extends BaseEntity {

    /** Human-readable label for this set of default values. */
    @Column(name = "name", nullable = false)
    private String name;

    // =========================================================================
    // LEFT COLUMN — primary hematology values (with their own units)
    // =========================================================================

    @Column(name = "hemoglobin")
    private String hemoglobin;

    @Column(name = "hematocrit")
    private String hematocrit;

    @Column(name = "rbc_count")
    private String rbcCount;

    @Column(name = "wbc_count")
    private String wbcCount;

    @Column(name = "platelet")
    private String platelet;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "esr_male")
    private String esrMale;

    @Column(name = "esr_female")
    private String esrFemale;

    // =========================================================================
    // MIDDLE COLUMN — differential count (values are percentages)
    // =========================================================================

    @Column(name = "lymphocytes")
    private String lymphocytes;

    @Column(name = "segmenters")
    private String segmenters;

    @Column(name = "eosinophils")
    private String eosinophils;

    @Column(name = "monocytes")
    private String monocytes;

    @Column(name = "myelocytes")
    private String myelocytes;

    @Column(name = "juveniles")
    private String juveniles;

    // =========================================================================
    // RIGHT COLUMN — additional differential (values are percentages)
    // =========================================================================

    @Column(name = "stab_cells")
    private String stabCells;

    @Column(name = "basophils")
    private String basophils;

    @Column(name = "others")
    private String others;
}
