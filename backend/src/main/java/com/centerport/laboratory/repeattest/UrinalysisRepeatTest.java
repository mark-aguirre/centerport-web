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
 * Urinalysis Repeat Test entity storing re-test results for the urinalysis
 * section of a {@link LaboratoryReport}.
 *
 * Multiple repeat tests can be linked to a single laboratory report,
 * enabling trend tracking when initial results require confirmation.
 * Each repeat test receives a unique business ID (format:
 * {@code URIN00000001}) generated from the {@code urin_seq}
 * PostgreSQL sequence.
 *
 * Sections:
 * - Metadata (result date, lab number, personnel, remarks)
 * - Macroscopic (color, transparency)
 * - Chemical (leucocytes, nitrite, urobilinogen, protein, pH, blood,
 *   specific gravity, ketone, bilirubin, glucose, others)
 * - Microscopic (RBC, WBC, amorphous urates/phosphate, epithelial cells,
 *   mucus threads, others)
 * - Crystals (uric acid, calcium oxalate, others)
 * - Cast (fine granular, coarse granular, others)
 *
 * @see LaboratoryReport
 * @see UrinalysisRepeatTestService
 * @see UrinalysisRepeatTestRepository
 */
@Getter
@Setter
@Entity
@Table(name = "urinalysis_repeat_tests")
public class UrinalysisRepeatTest extends BaseEntity {

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
    @Column(name = "urine_color")
    private String urineColor;

    @Column(name = "urine_transparency")
    private String urineTransparency;

    // --- Chemical ---
    @Column(name = "urine_leucocytes")
    private String urineLeucocytes;

    @Column(name = "urine_nitrite")
    private String urineNitrite;

    @Column(name = "urine_urobilinogen")
    private String urineUrobilinogen;

    @Column(name = "urine_protein")
    private String urineProtein;

    @Column(name = "urine_ph")
    private String urinePh;

    @Column(name = "urine_blood")
    private String urineBlood;

    @Column(name = "urine_specific_gravity")
    private String urineSpecificGravity;

    @Column(name = "urine_ketone")
    private String urineKetone;

    @Column(name = "urine_bilirubin")
    private String urineBilirubin;

    @Column(name = "urine_glucose")
    private String urineGlucose;

    @Column(name = "urine_others")
    private String urineOthers;

    // --- Microscopic ---
    @Column(name = "urine_rbc")
    private String urineRbc;

    @Column(name = "urine_wbc")
    private String urineWbc;

    @Column(name = "urine_amorphous_urates")
    private String urineAmorphousUrates;

    @Column(name = "urine_amorphous_phosphate")
    private String urineAmorphousPhosphate;

    @Column(name = "urine_epithelial_cells")
    private String urineEpithelialCells;

    @Column(name = "urine_mucus_threads")
    private String urineMucusThreads;

    @Column(name = "urine_microscopic_others")
    private String urineMicroscopicOthers;

    // --- Crystals ---
    @Column(name = "urine_uric_acid")
    private String urineUricAcid;

    @Column(name = "urine_calcium_oxalate")
    private String urineCalciumOxalate;

    @Column(name = "urine_crystals_others")
    private String urineCrystalsOthers;

    // --- Cast ---
    @Column(name = "urine_fine_granular")
    private String urineFineGranular;

    @Column(name = "urine_coarse_granular")
    private String urineCoarseGranular;

    @Column(name = "urine_cast_others")
    private String urineCastOthers;
}
