package com.centerport.immunology;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link ImmunologyReport}.
 *
 * Mirrors the entity field structure for the immunology/serology section
 * (PSA, other test, HBsAg, RPR, Anti-HBs).
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
 * @see ImmunologyReport
 * @see ImmunologyReportMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImmunologyReportDto {

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
    // IMMUNOLOGY / SEROLOGY TESTS
    // ======================================================================
    private String psaReference;
    private String psaResult;

    private String otherTestName;
    private String otherReference;
    private String otherResult;

    private String hbsagResult;
    private String rprResult;

    private String antiHbsResult;
    private String antiHbsCutOff;
    private String antiHbsResultLine;
}
