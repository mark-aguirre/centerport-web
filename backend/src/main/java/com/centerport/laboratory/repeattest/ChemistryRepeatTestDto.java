package com.centerport.laboratory.repeattest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link ChemistryRepeatTest}.
 *
 * Mirrors the entity field structure across metadata, clinical chemistry,
 * and serology/immunology sections. Field names serialize to snake_case
 * via the global {@code JacksonConfig}.
 *
 * Validation:
 * Only {@code laboratoryReportId} is required. All test-result fields are
 * optional — individual values are filled as results become available.
 *
 * @see ChemistryRepeatTest
 * @see ChemistryRepeatTestMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChemistryRepeatTestDto {

    private UUID id;
    private String resultId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotNull(message = "laboratory report ID must not be null")
    private UUID laboratoryReportId;

    // --- Metadata ---
    private String resultDate;
    private String laboratoryNo;
    private String medTech;
    private String medTechLicenseNo;
    private String pathologist;
    private String pathologistLicenseNo;
    private String requestedBy;
    private String remarks;

    // --- FBS ---
    private String fbsResultSi;
    private String fbsResultConv;
    private Boolean fbsHigh;

    // --- BUN ---
    private String bunResultSi;
    private String bunResultConv;
    private Boolean bunHigh;

    // --- Creatinine ---
    private String creatinineResultSi;
    private String creatinineResultConv;
    private Boolean creatinineHigh;

    // --- Cholesterol ---
    private String cholesterolResultSi;
    private String cholesterolResultConv;
    private Boolean cholesterolHigh;

    // --- Triglycerides ---
    private String triglyceridesResultSi;
    private String triglyceridesResultConv;
    private Boolean triglyceridesHigh;

    // --- Uric Acid ---
    private String uricAcidResultSi;
    private String uricAcidResultConv;
    private Boolean uricAcidHigh;

    // --- SGOT ---
    private String sgotResultSi;
    private String sgotResultConv;
    private Boolean sgotHigh;

    // --- SGPT ---
    private String sgptResultSi;
    private String sgptResultConv;
    private Boolean sgptHigh;

    // --- ALK. PHOS ---
    private String alkPhosResultSi;
    private String alkPhosResultConv;
    private Boolean alkPhosHigh;

    // --- HbA1c ---
    private String hba1cResult;
    private Boolean hba1cHigh;

    // --- Serology/Immunology ---
    private String rpr;
    private String hbsag;
    private String widalTest;
    private String malarialSmear;
}
