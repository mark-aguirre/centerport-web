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
 * Fecalysis Repeat Test entity storing re-test results for the fecalysis
 * section of a {@link LaboratoryReport}.
 *
 * Multiple repeat tests can be linked to a single laboratory report,
 * enabling trend tracking when initial results require confirmation.
 * Each repeat test receives a unique business ID (format:
 * {@code FECL00000001}) generated from the {@code fecl_seq} PostgreSQL
 * sequence.
 *
 * Sections:
 * - Metadata (result date, lab number, personnel, remarks)
 * - Macroscopic (color, consistency)
 * - Microscopic (RBC, WBC, others)
 * - Ova/Parasite and Amoeba
 * - Occult Blood
 *
 * @see LaboratoryReport
 * @see FecalysisRepeatTestService
 * @see FecalysisRepeatTestRepository
 */
@Getter
@Setter
@Entity
@Table(name = "fecalysis_repeat_tests")
public class FecalysisRepeatTest extends BaseEntity {

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

    // --- Macroscopic ---
    @Column(name = "fecal_color")
    private String fecalColor;

    @Column(name = "fecal_consistency")
    private String fecalConsistency;

    // --- Microscopic ---
    @Column(name = "fecal_rbc")
    private String fecalRbc;

    @Column(name = "fecal_rbc_hpf")
    private String fecalRbcHpf;

    @Column(name = "fecal_wbc")
    private String fecalWbc;

    @Column(name = "fecal_wbc_hpf")
    private String fecalWbcHpf;

    @Column(name = "fecal_others")
    private String fecalOthers;

    // --- Ova/Parasite & Amoeba ---
    @Column(name = "fecal_ova_parasite")
    private String fecalOvaParasite;

    @Column(name = "fecal_ova_parasite_lpf")
    private String fecalOvaParasiteLpf;

    @Column(name = "fecal_amoeba")
    private String fecalAmoeba;

    @Column(name = "fecal_amoeba_lpf")
    private String fecalAmoebaLpf;

    // --- Occult Blood ---
    @Column(name = "fecal_occult_blood")
    private String fecalOccultBlood;
}
