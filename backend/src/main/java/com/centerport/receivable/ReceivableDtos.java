package com.centerport.receivable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * DTO carriers for the Receivable Report feature.
 *
 * Grouped in one file because they are small, tightly-related response shapes
 * used only by the receivables endpoints. All serialize to snake_case via the
 * global {@link com.centerport.config.JacksonConfig}.
 */
public final class ReceivableDtos {

    private ReceivableDtos() {
    }

    /** A selectable company account (backed by an employer/agency). */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceivableAccount {
        private UUID id;
        private String name;
    }

    /** A configured payment-type option for the report filter. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentTypeOption {
        private String id;
        private String label;
    }

    /** A single row in the generated receivable report. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceivableReportRow {
        private String id;
        private String transactionId;
        private String customerName;
        private String accountName;
        private String description;
        private String paymentType;
        private Boolean isPackage;
        private BigDecimal amount;
        private LocalDate date;
    }

    /** The full report payload: rows plus totals. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceivableReport {
        private List<ReceivableReportRow> rows;
        private long totalCount;
        private BigDecimal totalAmount;
    }
}
