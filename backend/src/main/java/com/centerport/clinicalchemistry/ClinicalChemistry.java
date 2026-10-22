package com.centerport.clinicalchemistry;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Clinical Chemistry entity — a named set of Clinical Chemistry and
 * Serology/Immunology reference / "normal value" strings used to pre-fill a
 * Clinical Chemistry report.
 *
 * This is a configuration/settings record maintained by Laboratory staff, not
 * per-patient data: there is no seafarer profile link. Each examination keeps
 * two reference ranges — an S.I. Unit value and a Conventional Unit value — and
 * both are stored verbatim as free text (e.g. {@code "3.8 - 5.8"}).
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see ClinicalChemistryService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "clinical_chemistry_default_values")
public class ClinicalChemistry extends BaseEntity {

    /** Human-readable label for this set of default values. */
    @Column(name = "name", nullable = false)
    private String name;

    // =========================================================================
    // Each examination has an S.I. Unit value and a Conventional Unit value.
    // =========================================================================

    @Column(name = "fbs_si")
    private String fbsSi;

    @Column(name = "fbs_conv")
    private String fbsConv;

    @Column(name = "bun_si")
    private String bunSi;

    @Column(name = "bun_conv")
    private String bunConv;

    @Column(name = "creatinine_si")
    private String creatinineSi;

    @Column(name = "creatinine_conv")
    private String creatinineConv;

    @Column(name = "cholesterol_si")
    private String cholesterolSi;

    @Column(name = "cholesterol_conv")
    private String cholesterolConv;

    @Column(name = "triglycerides_si")
    private String triglyceridesSi;

    @Column(name = "triglycerides_conv")
    private String triglyceridesConv;

    @Column(name = "uric_acid_si")
    private String uricAcidSi;

    @Column(name = "uric_acid_conv")
    private String uricAcidConv;

    @Column(name = "sgot_si")
    private String sgotSi;

    @Column(name = "sgot_conv")
    private String sgotConv;

    @Column(name = "sgpt_si")
    private String sgptSi;

    @Column(name = "sgpt_conv")
    private String sgptConv;

    @Column(name = "alk_phos_si")
    private String alkPhosSi;

    @Column(name = "alk_phos_conv")
    private String alkPhosConv;
}
