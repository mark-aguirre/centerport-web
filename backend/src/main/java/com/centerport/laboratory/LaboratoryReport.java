package com.centerport.laboratory;

import com.centerport.common.entity.BaseEntity;
import com.centerport.profile.SeafarerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Laboratory Report entity representing a complete set of diagnostic test results.
 *
 * Aggregates results from four examination sections:
 * - Hematology (CBC, differential count, blood type, ESR)
 * - Clinical Chemistry and Serology/Immunology (FBS, BUN, creatinine,
 *   cholesterol, triglycerides, uric acid, liver enzymes, HbA1c)
 * - Urinalysis (macroscopic, chemical, microscopic, crystals, casts)
 * - Fecalysis (macroscopic, microscopic, occult blood)
 *
 * Each report is linked to a {@link SeafarerProfile} for patient identity and
 * assigned a unique business ID (format: {@code LAB00000001}) generated from
 * the {@code lab_seq} PostgreSQL sequence.
 *
 * @see SeafarerProfile
 * @see LaboratoryReportService
 * @see LaboratoryReportRepository
 */
@Getter
@Setter
@Entity
@Table(name = "laboratory_reports")
public class LaboratoryReport extends BaseEntity {

    @Column(name = "report_id", unique = true)
    private String reportId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Report Header ---
    @Column(name = "result_date")
    private String resultDate;

    @Column(name = "med_tech")
    private String medTech;

    @Column(name = "med_tech_license_no")
    private String medTechLicenseNo;

    @Column(name = "pathologist")
    private String pathologist;

    @Column(name = "pathologist_license_no")
    private String pathologistLicenseNo;

    @Column(name = "laboratory_no")
    private String laboratoryNo;

    // ======================================================================
    // HEMATOLOGY
    // ======================================================================

    @Column(name = "hematology_result_date")
    private String hematologyResultDate;

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

    // ======================================================================
    // CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
    // ======================================================================

    @Column(name = "chemistry_result_date")
    private String chemistryResultDate;

    // --- FBS ---
    @Column(name = "fbs_si")
    private String fbsSi;

    @Column(name = "fbs_si_normal")
    private String fbsSiNormal;

    @Column(name = "fbs_conv")
    private String fbsConv;

    @Column(name = "fbs_result_si")
    private String fbsResultSi;

    @Column(name = "fbs_result_conv")
    private String fbsResultConv;

    @Column(name = "fbs_high")
    private Boolean fbsHigh;

    // --- BUN ---
    @Column(name = "bun_si")
    private String bunSi;

    @Column(name = "bun_si_normal")
    private String bunSiNormal;

    @Column(name = "bun_conv")
    private String bunConv;

    @Column(name = "bun_result_si")
    private String bunResultSi;

    @Column(name = "bun_result_conv")
    private String bunResultConv;

    @Column(name = "bun_high")
    private Boolean bunHigh;

    // --- Creatinine ---
    @Column(name = "creatinine_si")
    private String creatinineSi;

    @Column(name = "creatinine_si_normal")
    private String creatinineSiNormal;

    @Column(name = "creatinine_conv")
    private String creatinineConv;

    @Column(name = "creatinine_result_si")
    private String creatinineResultSi;

    @Column(name = "creatinine_result_conv")
    private String creatinineResultConv;

    @Column(name = "creatinine_high")
    private Boolean creatinineHigh;

    // --- Cholesterol ---
    @Column(name = "cholesterol_si")
    private String cholesterolSi;

    @Column(name = "cholesterol_si_normal")
    private String cholesterolSiNormal;

    @Column(name = "cholesterol_conv")
    private String cholesterolConv;

    @Column(name = "cholesterol_result_si")
    private String cholesterolResultSi;

    @Column(name = "cholesterol_result_conv")
    private String cholesterolResultConv;

    @Column(name = "cholesterol_high")
    private Boolean cholesterolHigh;

    // --- Triglycerides ---
    @Column(name = "triglycerides_si")
    private String triglyceridesSi;

    @Column(name = "triglycerides_si_normal")
    private String triglyceridesSiNormal;

    @Column(name = "triglycerides_conv")
    private String triglyceridesConv;

    @Column(name = "triglycerides_result_si")
    private String triglyceridesResultSi;

    @Column(name = "triglycerides_result_conv")
    private String triglyceridesResultConv;

    @Column(name = "triglycerides_high")
    private Boolean triglyceridesHigh;

    // --- Uric Acid ---
    @Column(name = "uric_acid_si")
    private String uricAcidSi;

    @Column(name = "uric_acid_si_normal")
    private String uricAcidSiNormal;

    @Column(name = "uric_acid_conv")
    private String uricAcidConv;

    @Column(name = "uric_acid_result_si")
    private String uricAcidResultSi;

    @Column(name = "uric_acid_result_conv")
    private String uricAcidResultConv;

    @Column(name = "uric_acid_high")
    private Boolean uricAcidHigh;

    // --- SGOT ---
    @Column(name = "sgot_si")
    private String sgotSi;

    @Column(name = "sgot_result_si")
    private String sgotResultSi;

    @Column(name = "sgot_result_conv")
    private String sgotResultConv;

    @Column(name = "sgot_high")
    private Boolean sgotHigh;

    // --- SGPT ---
    @Column(name = "sgpt_si")
    private String sgptSi;

    @Column(name = "sgpt_result_si")
    private String sgptResultSi;

    @Column(name = "sgpt_result_conv")
    private String sgptResultConv;

    @Column(name = "sgpt_high")
    private Boolean sgptHigh;

    // --- ALK. PHOS ---
    @Column(name = "alk_phos_si")
    private String alkPhosSi;

    @Column(name = "alk_phos_result_si")
    private String alkPhosResultSi;

    @Column(name = "alk_phos_result_conv")
    private String alkPhosResultConv;

    @Column(name = "alk_phos_high")
    private Boolean alkPhosHigh;

    // --- HbA1c ---
    @Column(name = "hba1c_normal")
    private String hba1cNormal;

    @Column(name = "hba1c_result")
    private String hba1cResult;

    @Column(name = "hba1c_high")
    private Boolean hba1cHigh;

    // ======================================================================
    // URINALYSIS
    // ======================================================================

    @Column(name = "urinalysis_result_date")
    private String urinalysisResultDate;

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

    // ======================================================================
    // FECALYSIS
    // ======================================================================

    @Column(name = "fecalysis_result_date")
    private String fecalysisResultDate;

    @Column(name = "fecal_color")
    private String fecalColor;

    @Column(name = "fecal_consistency")
    private String fecalConsistency;

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

    @Column(name = "fecal_ova_parasite")
    private String fecalOvaParasite;

    @Column(name = "fecal_ova_parasite_lpf")
    private String fecalOvaParasiteLpf;

    @Column(name = "fecal_amoeba")
    private String fecalAmoeba;

    @Column(name = "fecal_amoeba_lpf")
    private String fecalAmoebaLpf;

    @Column(name = "fecal_occult_blood")
    private String fecalOccultBlood;
}
