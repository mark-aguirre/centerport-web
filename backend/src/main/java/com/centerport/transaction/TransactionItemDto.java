package com.centerport.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Data transfer object for a {@link TransactionItem}. Used both as settle input
 * (per line) and as output within {@link TransactionDto}.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionItemDto {

    private UUID id;

    @NotNull(message = "product_id must not be null")
    private UUID productId;

    @NotBlank(message = "description_snapshot must not be blank")
    private String descriptionSnapshot;

    @PositiveOrZero(message = "price_snapshot must not be negative")
    private BigDecimal priceSnapshot;

    @PositiveOrZero(message = "professional_fee must not be negative")
    private BigDecimal professionalFee;

    @NotBlank(message = "billing_type must not be blank")
    private String billingType;

    private Boolean personalAccount;
}
