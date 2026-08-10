package com.centerport.laboratory.repeattest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link UrinalysisRepeatTest}.
 *
 * Mirrors the entity field structure across metadata, macroscopic, chemical,
 * microscopic, crystals, and cast sections. Field names serialize to snake_case
 * via the global {@code JacksonConfig}.
 *
 * Validation:
 * Only {@code laboratoryReportId} is required. All test-result fields are
 * optional — individual values are filled as results become available.
 *
 * @see UrinalysisRepeatTest
 * @see UrinalysisRepeatTestMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrinalysisRepeatTestDto {

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
}
