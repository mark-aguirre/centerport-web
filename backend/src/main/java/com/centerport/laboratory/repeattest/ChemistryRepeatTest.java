package com.centerport.laboratory.repeattest;

import com.centerport.common.entity.BaseEntity;
import com.centerport.laboratory.LaboratoryReport;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Chemistry Repeat Test entity storing re-test results for the clinical
 * chemistry and serology/immunology section of a {@link LaboratoryReport}.
 *
 * Multiple repeat tests can be linked to a single laboratory report,
 * enabling trend tracking when initial results require confirmation.
 * Each repeat test receives a unique business ID (format:
 * {@code CHEM00000001}) generated from the {@code chem_repeat_seq}
 * PostgreSQL sequence.
 *
 * Sections:
 * - Metadata (result date, lab number, personnel, remarks)
 * - Clinical Chemistry (FBS, BUN, Creatinine, Cholesterol, Triglycerides,
 *   Uric Acid, SGOT, SGPT, ALK PHOS, HbA1c)
 * - Serology/Immunology (RPR, HBsAG, Widal Test, Malarial Smear)
 *
 * @see LaboratoryReport
 * @see ChemistryRepeatTestService
 * @see ChemistryRepeatTestRepository
 */
@Getter
@Setter
@Entity
@Table(name = "chemistry_repeat_tests")
public class ChemistryRepeatTest extends BaseEntity {

    @Column(name = "result_id", unique = true)
    private String resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laboratory_report_id", nullable = false)
    private LaboratoryReport laboratoryReport;

    // --- Metadata ---
    @Column(name = "result_date")
    private String resultDate;

    @Column(name = "laboratory_no")
    private String laboratoryNo;

    @Column(name = "med_tech")
    private String medTech;

    @Column(name = "med_tech_license_no")
    private String medTechLicenseNo;

    @Column(name = "pathologist")
    private String pathologist;

    @Column(name = "pathologist_license_no")
    private String pathologistLicenseNo;

    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "remarks")
    private String remarks;

    // --- FBS ---
    @Column(name = "fbs_result_si")
    private String fbsResultSi;

    @Column(name = "fbs_result_conv")
    private String fbsResultConv;

    @Column(name = "fbs_high")
    private Boolean fbsHigh;

    // --- BUN ---
    @Column(name = "bun_result_si")
    private String bunResultSi;

    @Column(name = "bun_result_conv")
    private String bunResultConv;

    @Column(name = "bun_high")
    private Boolean bunHigh;

    // --- Creatinine ---
    @Column(name = "creatinine_result_si")
    private String creatinineResultSi;

    @Column(name = "creatinine_result_conv")
    private String creatinineResultConv;

    @Column(name = "creatinine_high")
    private Boolean creatinineHigh;

    // --- Cholesterol ---
    @Column(name = "cholesterol_result_si")
    private String cholesterolResultSi;

    @Column(name = "cholesterol_result_conv")
    private String cholesterolResultConv;

    @Column(name = "cholesterol_high")
    private Boolean cholesterolHigh;

    // --- Triglycerides ---
    @Column(name = "triglycerides_result_si")
    private String triglyceridesResultSi;

    @Column(name = "triglycerides_result_conv")
    private String triglyceridesResultConv;

    @Column(name = "triglycerides_high")
    private Boolean triglyceridesHigh;

    // --- Uric Acid ---
    @Column(name = "uric_acid_result_si")
    private String uricAcidResultSi;

    @Column(name = "uric_acid_result_conv")
    private String uricAcidResultConv;

    @Column(name = "uric_acid_high")
    private Boolean uricAcidHigh;

    // --- SGOT ---
    @Column(name = "sgot_result_si")
    private String sgotResultSi;

    @Column(name = "sgot_result_conv")
    private String sgotResultConv;

    @Column(name = "sgot_high")
    private Boolean sgotHigh;

    // --- SGPT ---
    @Column(name = "sgpt_result_si")
    private String sgptResultSi;

    @Column(name = "sgpt_result_conv")
    private String sgptResultConv;

    @Column(name = "sgpt_high")
    private Boolean sgptHigh;

    // --- ALK. PHOS ---
    @Column(name = "alk_phos_result_si")
    private String alkPhosResultSi;

    @Column(name = "alk_phos_result_conv")
    private String alkPhosResultConv;

    @Column(name = "alk_phos_high")
    private Boolean alkPhosHigh;

    // --- HbA1c ---
    @Column(name = "hba1c_result")
    private String hba1cResult;

    @Column(name = "hba1c_high")
    private Boolean hba1cHigh;

    // --- Serology/Immunology ---
    @Column(name = "rpr")
    private String rpr;

    @Column(name = "hbsag")
    private String hbsag;

    @Column(name = "widal_test")
    private String widalTest;

    @Column(name = "malarial_smear")
    private String malarialSmear;
}
