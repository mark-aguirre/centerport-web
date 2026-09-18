package com.centerport.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for {@link Item}.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code itemId}, {@code createdDate}, {@code updatedDate}) appear
 * in response output but are ignored on create/update input.
 *
 * @see Item the corresponding entity
 * @see ItemMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {

    private UUID id;
    private String itemId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotBlank(message = "must not be blank")
    private String name;

    private String description;

    @PositiveOrZero(message = "must not be negative")
    private BigDecimal price;

    @PositiveOrZero(message = "must not be negative")
    private BigDecimal professionalFee;

    private Boolean isPackage;

    private Boolean active;
}
