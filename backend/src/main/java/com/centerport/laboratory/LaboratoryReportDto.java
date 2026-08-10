package com.centerport.laboratory;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link LaboratoryReport}.
 *
 * Mirrors the entity field structure across four diagnostic sections:
 * hematology, clinical chemistry/serology, urinalysis, and fecalysis.
 *
 * Serialization:
 * All field names serialize to snake_case via the global
 * {@code JacksonConfig}. System fields ({@code id}, {@code reportId},
 * {@code createdDate}, {@code updatedDate}) are populated in responses
 * but ignored on create/update input.
 *
 * Validation:
 * Only {@code seafarerProfileId} is required. All test-result fields are
 * optional — sections may be filled progressively as results arrive.
 *
 * @see LaboratoryReport
 * @see LaboratoryReportMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LaboratoryReportDto {

    private UUID id;
    private String reportId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- Seafarer Profile Reference ---
    @NotNull(message = "seafarer profile ID must not be null")
    private UUID seafarerProfileId;

    /** Populated in responses; ignored on input. */
    private SeafarerProfileDto seafarerProfile;

    // --- Report Header ---
    private String resultDate;
    private String medTech;
    private String medTechLicenseNo;
    private String pathologist;
    private String pathologistLicenseNo;
    private String laboratoryNo;

    // ======================================================================
    // HEMATOLOGY
    // ======================================================================
    private String hematologyResultDate;

    private String hemoglobin;
    private String hemoglobinNormalMin;
    private String hemoglobinNormalMax;

    private String hematocrit;
    private String hematocritNormalMin;
    private String hematocritNormalMax;

    private String rbcCount;
    private String rbcCountNormalMin;
    private String rbcCountNormalMax;

    private String wbcCount;
    private String wbcCountNormalMin;
    private String wbcCountNormalMax;

    private String platelet;
    private String plateletNormalMin;
    private String plateletNormalMax;

    private String bloodType;

    private String esr;
    private String esrNormalMale;
    private String esrNormalFemale;

    // --- Differential Count ---
    private String lymphocytes;
    private String lymphocytesNormalMin;
    private String lymphocytesNormalMax;

    private String segmenters;
    private String eosinophils;
    private String monocytes;
    private String myelocytes;
    private String juveniles;

    private String stabCells;
    private String stabCellsNormalMin;
    private String stabCellsNormalMax;

    private String basophils;
    private String othersDiff;

    // ======================================================================
    // CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
    // ======================================================================
    private String chemistryResultDate;

    // --- FBS ---
    private String fbsSi;
    private String fbsSiNormal;
    private String fbsConv;
    private String fbsResultSi;
    private String fbsResultConv;
    private Boolean fbsHigh;

    // --- BUN ---
    private String bunSi;
    private String bunSiNormal;
    private String bunConv;
    private String bunResultSi;
    private String bunResultConv;
    private Boolean bunHigh;

    // --- Creatinine ---
    private String creatinineSi;
    private String creatinineSiNormal;
    private String creatinineConv;
    private String creatinineResultSi;
    private String creatinineResultConv;
    private Boolean creatinineHigh;

    // --- Cholesterol ---
    private String cholesterolSi;
    private String cholesterolSiNormal;
    private String cholesterolConv;
    private String cholesterolResultSi;
    private String cholesterolResultConv;
    private Boolean cholesterolHigh;

    // --- Triglycerides ---
    private String triglyceridesSi;
    private String triglyceridesSiNormal;
    private String triglyceridesConv;
    private String triglyceridesResultSi;
    private String triglyceridesResultConv;
    private Boolean triglyceridesHigh;

    // --- Uric Acid ---
    private String uricAcidSi;
    private String uricAcidSiNormal;
    private String uricAcidConv;
    private String uricAcidResultSi;
    private String uricAcidResultConv;
    private Boolean uricAcidHigh;

    // --- SGOT ---
    private String sgotSi;
    private String sgotResultSi;
    private String sgotResultConv;
    private Boolean sgotHigh;

    // --- SGPT ---
    private String sgptSi;
    private String sgptResultSi;
    private String sgptResultConv;
    private Boolean sgptHigh;

    // --- ALK. PHOS ---
    private String alkPhosSi;
    private String alkPhosResultSi;
    private String alkPhosResultConv;
    private Boolean alkPhosHigh;

    // --- HbA1c ---
    private String hba1cNormal;
    private String hba1cResult;
    private Boolean hba1cHigh;

    // ======================================================================
    // URINALYSIS
    // ======================================================================
    private String urinalysisResultDate;

    // --- Macroscopic ---
    private String urineColor;
    private String urineTransparency;

    // --- Chemical ---
    private String urineLeucocytes;
    private String urineNitrite;
    private String urineUrobilinogen;
    private String urineProtein;
    private String urinePh;
    private String urineBlood;
    private String urineSpecificGravity;
    private String urineKetone;
    private String urineBilirubin;
    private String urineGlucose;
    private String urineOthers;

    // --- Microscopic ---
    private String urineRbc;
    private String urineWbc;
    private String urineAmorphousUrates;
    private String urineAmorphousPhosphate;
    private String urineEpithelialCells;
    private String urineMucusThreads;
    private String urineMicroscopicOthers;

    // --- Crystals ---
    private String urineUricAcid;
    private String urineCalciumOxalate;
    private String urineCrystalsOthers;

    // --- Cast ---
    private String urineFineGranular;
    private String urineCoarseGranular;
    private String urineCastOthers;

    // ======================================================================
    // FECALYSIS
    // ======================================================================
    private String fecalysisResultDate;

    private String fecalColor;
    private String fecalConsistency;

    private String fecalRbc;
    private String fecalRbcHpf;
    private String fecalWbc;
    private String fecalWbcHpf;
    private String fecalOthers;

    private String fecalOvaParasite;
    private String fecalOvaParasiteLpf;
    private String fecalAmoeba;
    private String fecalAmoebaLpf;
    private String fecalOccultBlood;
}
