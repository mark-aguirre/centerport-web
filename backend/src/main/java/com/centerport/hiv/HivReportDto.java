package com.centerport.hiv;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link HivReport}.
 *
 * Mirrors the entity field structure for the HIV screening section (report
 * header, screening tests used, and the reactive result).
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
 * @see HivReport
 * @see HivReportMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HivReportDto {

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
    private String medTech;
    private String hivProficiencyCertNo;
    private String pathologist;
    private String pathologistLicenseNo;
    private String examiningPhysician;
    private String physicianLicenseNo;
    private String resultDate;
    private String expireDate;

    // ======================================================================
    // HIV (HIV-1) SCREEN TEST
    // ======================================================================
    private Boolean testRapid;
    private Boolean testParticleAgglutination;
    private Boolean testEiaCmaElfa;
    private String testOthers;
    private String result;
}
