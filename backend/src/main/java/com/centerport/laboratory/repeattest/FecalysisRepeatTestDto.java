package com.centerport.laboratory.repeattest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link FecalysisRepeatTest}.
 *
 * Mirrors the entity field structure across metadata, macroscopic,
 * microscopic, ova/parasite, and occult blood sections. Field names
 * serialize to snake_case via the global {@code JacksonConfig}.
 *
 * Validation:
 * Only {@code laboratoryReportId} is required. All test-result fields are
 * optional — individual values are filled as results become available.
 *
 * @see FecalysisRepeatTest
 * @see FecalysisRepeatTestMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FecalysisRepeatTestDto {

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
    private String fecalColor;
    private String fecalConsistency;

    // --- Microscopic ---
    private String fecalRbc;
    private String fecalRbcHpf;
    private String fecalWbc;
    private String fecalWbcHpf;
    private String fecalOthers;

    // --- Ova/Parasite & Amoeba ---
    private String fecalOvaParasite;
    private String fecalOvaParasiteLpf;
    private String fecalAmoeba;
    private String fecalAmoebaLpf;

    // --- Occult Blood ---
    private String fecalOccultBlood;
}
