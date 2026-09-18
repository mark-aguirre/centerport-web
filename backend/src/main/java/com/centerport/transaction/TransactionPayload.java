package com.centerport.transaction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Settle-transaction request payload. The backend recalculates the total from
 * the item snapshots; the client does not send a total.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionPayload {

    @NotNull(message = "customer_id must not be null")
    private UUID customerId;

    @NotNull(message = "default_billing_type must not be null")
    private String defaultBillingType;

    private BigDecimal defaultProfessionalFee;

    @NotEmpty(message = "at least one item is required")
    @Valid
    private List<TransactionItemDto> items;
}
