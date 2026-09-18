package com.centerport.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Lightweight transaction row for the history list. Omits the full item array;
 * {@code billingType} is the transaction's default billing type for display.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSummaryDto {

    private UUID id;
    private String transactionId;
    private String customerName;
    private TransactionStatus status;
    private String billingType;
    private BigDecimal totalAmount;
    private LocalDateTime createdDate;
    private LocalDateTime settledAt;
}
