package com.centerport.employer;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link Employer}.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code employerId}, {@code createdDate}, {@code updatedDate})
 * are included in response output but ignored on create/update input.
 *
 * Validation:
 * - {@code name} is required (must not be blank)
 *
 * @see Employer the corresponding entity
 * @see EmployerMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDto {

    private UUID id;
    private String employerId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    private Boolean active;
}
