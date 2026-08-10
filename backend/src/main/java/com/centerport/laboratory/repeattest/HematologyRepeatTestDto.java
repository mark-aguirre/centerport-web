package com.centerport.laboratory.repeattest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link HematologyRepeatTest}.
 *
 * Mirrors the entity field structure across metadata, CBC, and differential
 * count sections. Field names serialize to snake_case via the global
 * {@code JacksonConfig}.
 *
 * Validation:
 * Only {@code laboratoryReportId} is required. All test-result fields are
 * optional — individual values are filled as results become available.
 *
 * @see HematologyRepeatTest
 * @see HematologyRepeatTestMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HematologyRepeatTestDto {

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

    // --- Hematology CBC ---
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
}
