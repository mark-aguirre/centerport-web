package com.centerport.personnel;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for MedicalPersonnel.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code personnelId}, {@code createdDate}, {@code updatedDate})
 * are included in response output but ignored on create/update input.
 *
 * Validation:
 * - {@code name} is required (must not be blank)
 * - {@code licenseNo} is required (must not be blank)
 *
 * @see MedicalPersonnel the corresponding entity
 * @see MedicalPersonnelMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalPersonnelDto {

    private UUID id;
    private String personnelId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    @NotBlank(message = "must not be blank")
    private String licenseNo;

    private String specialization;

    /** Structured role/category (e.g. MED_TECH, PATHOLOGIST). */
    private PersonnelRole role;

    private String title;

    /** URL of the uploaded signature image, if any. */
    private String signatureUrl;

    private Boolean active;

    /** Audit: who created the record (output-only, server-managed). */
    private String createdBy;

    /** Audit: who last updated the record (output-only, server-managed). */
    private String updatedBy;
}
