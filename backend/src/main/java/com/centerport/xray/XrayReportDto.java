package com.centerport.xray;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link XrayReport}.
 *
 * Mirrors the entity field structure for the x-ray result (report header plus
 * x-ray number, radiology findings, and impression).
 *
 * Serialization:
 * All field names serialize to snake_case via the global
 * {@code JacksonConfig}. System fields ({@code id}, {@code reportId},
 * {@code createdDate}, {@code updatedDate}) are populated in responses
 * but ignored on create/update input.
 *
 * Validation:
 * Only {@code seafarerProfileId} is required. All result fields are optional —
 * a report may be filled progressively as the radiologist reads the study.
 *
 * @see XrayReport
 * @see XrayReportMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class XrayReportDto {

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
    private String xrayTech;
    private String xrayTechLicenseNo;
    private String radiologist;
    private String radiologistLicenseNo;

    // ======================================================================
    // X-RAY RESULT
    // ======================================================================
    private String xrayNo;
    private String radiologyFindings;
    private String impression;
}
