package com.centerport.defaultvalues;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link DefaultValues}.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code createdDate}, {@code updatedDate}) appear in response
 * output but are ignored on create/update input.
 *
 * Only {@code name} is required; every reference-value field is optional free
 * text (ranges like {@code "11-17"} are stored verbatim).
 *
 * @see DefaultValues the corresponding entity
 * @see DefaultValuesMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DefaultValuesDto {

    private UUID id;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    // --- Left column ---
    private String hemoglobin;
    private String hematocrit;
    private String rbcCount;
    private String wbcCount;
    private String platelet;
    private String bloodType;
    private String esrMale;
    private String esrFemale;

    // --- Middle column (differential %) ---
    private String lymphocytes;
    private String segmenters;
    private String eosinophils;
    private String monocytes;
    private String myelocytes;
    private String juveniles;

    // --- Right column (differential %) ---
    private String stabCells;
    private String basophils;
    private String others;
}
