package com.centerport.tumorimmunology;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link TumorImmunology}.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code createdDate}, {@code updatedDate}) appear in response
 * output but are ignored on create/update input.
 *
 * Only {@code name} is required; every reference-value field is optional free
 * text.
 *
 * @see TumorImmunology the corresponding entity
 * @see TumorImmunologyMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TumorImmunologyDto {

    private UUID id;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    // --- Tumor Marker ---
    private String psa;
    private String afp;
    private String tumorOthers;

    // --- Immunological Test ---
    private String antiHbs;
    private String antiHbcTotal;
    private String antiHcv;
    private String hbsag;
    private String immunoExtra;
    private String immunoOthers;
}
