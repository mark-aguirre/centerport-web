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
 * Hematology Repeat Test entity storing re-test results for the hematology
 * section of a {@link LaboratoryReport}.
 *
 * Multiple repeat tests can be linked to a single laboratory report,
 * enabling trend tracking when initial results require confirmation.
 * Each repeat test receives a unique business ID (format:
 * {@code HEMA00000001}) generated from the {@code hema_repeat_seq}
 * PostgreSQL sequence.
 *
 * Sections:
 * - Metadata (result date, lab number, personnel, remarks)
 * - Hematology CBC (hemoglobin, hematocrit, RBC, WBC, platelet,
 *   blood type, ESR with gender-specific normals)
 * - Differential Count (lymphocytes, segmenters, eosinophils, monocytes,
 *   myelocytes, juveniles, stab cells, basophils)
 *
 * @see LaboratoryReport
 * @see HematologyRepeatTestService
 * @see HematologyRepeatTestRepository
 */
@Getter
@Setter
@Entity
@Table(name = "hematology_repeat_tests")
public class HematologyRepeatTest extends BaseEntity {

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

    // --- Hematology CBC ---
    @Column(name = "hemoglobin")
    private String hemoglobin;

    @Column(name = "hemoglobin_normal_min")
    private String hemoglobinNormalMin;

    @Column(name = "hemoglobin_normal_max")
    private String hemoglobinNormalMax;

    @Column(name = "hematocrit")
    private String hematocrit;

    @Column(name = "hematocrit_normal_min")
    private String hematocritNormalMin;

    @Column(name = "hematocrit_normal_max")
    private String hematocritNormalMax;

    @Column(name = "rbc_count")
    private String rbcCount;

    @Column(name = "rbc_count_normal_min")
    private String rbcCountNormalMin;

    @Column(name = "rbc_count_normal_max")
    private String rbcCountNormalMax;

    @Column(name = "wbc_count")
    private String wbcCount;

    @Column(name = "wbc_count_normal_min")
    private String wbcCountNormalMin;

    @Column(name = "wbc_count_normal_max")
    private String wbcCountNormalMax;

    @Column(name = "platelet")
    private String platelet;

    @Column(name = "platelet_normal_min")
    private String plateletNormalMin;

    @Column(name = "platelet_normal_max")
    private String plateletNormalMax;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "esr")
    private String esr;

    @Column(name = "esr_normal_male")
    private String esrNormalMale;

    @Column(name = "esr_normal_female")
    private String esrNormalFemale;

    // --- Differential Count ---
    @Column(name = "lymphocytes")
    private String lymphocytes;

    @Column(name = "lymphocytes_normal_min")
    private String lymphocytesNormalMin;

    @Column(name = "lymphocytes_normal_max")
    private String lymphocytesNormalMax;

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

    @Column(name = "stab_cells")
    private String stabCells;

    @Column(name = "stab_cells_normal_min")
    private String stabCellsNormalMin;

    @Column(name = "stab_cells_normal_max")
    private String stabCellsNormalMax;

    @Column(name = "basophils")
    private String basophils;

    @Column(name = "others_diff")
    private String othersDiff;
}
