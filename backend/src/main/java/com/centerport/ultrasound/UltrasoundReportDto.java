package com.centerport.ultrasound;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link UltrasoundReport}.
 *
 * Mirrors the entity field structure for the ultrasound result (report header
 * plus examination, ultrasound number, radiology findings, and impression).
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
 * @see UltrasoundReport
 * @see UltrasoundReportMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UltrasoundReportDto {

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
    // ULTRASOUND RESULT
    // ======================================================================
    private String examination;
    private String ultrasoundNo;
    private String radiologyFindings;
    private String impression;
}
