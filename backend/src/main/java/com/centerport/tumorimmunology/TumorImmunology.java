package com.centerport.tumorimmunology;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Tumor / Immunological entity — a named set of "FORM LAB 33" reference values
 * (Tumor Marker + Immunological Test) used to pre-fill the tumor/immunology
 * report form.
 *
 * Configuration/settings record maintained by Laboratory staff, not per-patient
 * data: there is no seafarer profile link. All values are stored verbatim as
 * free text (S.I. Unit).
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see TumorImmunologyService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "tumor_immunology_default_values")
public class TumorImmunology extends BaseEntity {

    /** Human-readable label for this set of default values. */
    @Column(name = "name", nullable = false)
    private String name;

    // =========================================================================
    // TUMOR MARKER (unit: ML)
    // =========================================================================

    @Column(name = "psa")
    private String psa;

    @Column(name = "afp")
    private String afp;

    @Column(name = "tumor_others")
    private String tumorOthers;

    // =========================================================================
    // IMMUNOLOGICAL TEST
    // =========================================================================

    @Column(name = "anti_hbs")
    private String antiHbs;

    @Column(name = "anti_hbc_total")
    private String antiHbcTotal;

    @Column(name = "anti_hcv")
    private String antiHcv;

    @Column(name = "hbsag")
    private String hbsag;

    /** Extra unlabeled test row shown beneath HBsAg on the form. */
    @Column(name = "immuno_extra")
    private String immunoExtra;

    @Column(name = "immuno_others")
    private String immunoOthers;
}
