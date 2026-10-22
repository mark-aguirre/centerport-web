package com.centerport.clinicalchemistry;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link ClinicalChemistry}.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code createdDate}, {@code updatedDate}) appear in response
 * output but are ignored on create/update input.
 *
 * Only {@code name} is required; every reference-value field is optional free
 * text. Each examination carries both an S.I. and a Conventional range.
 *
 * @see ClinicalChemistry the corresponding entity
 * @see ClinicalChemistryMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalChemistryDto {

    private UUID id;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    private String fbsSi;
    private String fbsConv;

    private String bunSi;
    private String bunConv;

    private String creatinineSi;
    private String creatinineConv;

    private String cholesterolSi;
    private String cholesterolConv;

    private String triglyceridesSi;
    private String triglyceridesConv;

    private String uricAcidSi;
    private String uricAcidConv;

    private String sgotSi;
    private String sgotConv;

    private String sgptSi;
    private String sgptConv;

    private String alkPhosSi;
    private String alkPhosConv;
}
