package com.centerport.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Full transaction representation returned by settle and get-by-id.
 *
 * Serializes to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    private UUID id;
    private String transactionId;
    private UUID customerId;
    private String customerName;
    private TransactionStatus status;
    private String defaultBillingType;
    private BigDecimal defaultProfessionalFee;
    private BigDecimal totalAmount;
    private List<TransactionItemDto> items;
    private LocalDateTime createdDate;
    private LocalDateTime settledAt;
    private LocalDateTime voidedAt;
    private String voidReason;
}
