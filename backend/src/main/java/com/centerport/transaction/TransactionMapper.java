package com.centerport.transaction;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Converts {@link Transaction} aggregates to DTOs.
 *
 * Hand-written (rather than MapStruct) because the output needs the resolved
 * customer display name, which is not part of the entity, and because the
 * line-item mapping is a straightforward projection.
 */
@Component
public class TransactionMapper {

    /**
     * Maps a full transaction to its DTO, injecting the resolved customer name.
     *
     * @param entity       the transaction aggregate
     * @param customerName the resolved display name (may be null)
     * @return the full transaction DTO
     */
    public TransactionDto toDto(Transaction entity, String customerName) {
        List<TransactionItemDto> itemDtos = entity.getItems().stream()
                .map(this::toItemDto)
                .toList();

        return TransactionDto.builder()
                .id(entity.getId())
                .transactionId(entity.getTransactionId())
                .customerId(entity.getCustomerId())
                .customerName(customerName)
                .status(entity.getStatus())
                .defaultBillingType(entity.getDefaultBillingType())
                .defaultProfessionalFee(entity.getDefaultProfessionalFee())
                .totalAmount(entity.getTotalAmount())
                .items(itemDtos)
                .createdDate(entity.getCreatedDate())
                .settledAt(entity.getSettledAt())
                .voidedAt(entity.getVoidedAt())
                .voidReason(entity.getVoidReason())
                .build();
    }

    /** Maps a summary row for the history list. */
    public TransactionSummaryDto toSummary(Transaction entity, String customerName) {
        return TransactionSummaryDto.builder()
                .id(entity.getId())
                .transactionId(entity.getTransactionId())
                .customerName(customerName)
                .status(entity.getStatus())
                .billingType(entity.getDefaultBillingType())
                .totalAmount(entity.getTotalAmount())
                .createdDate(entity.getCreatedDate())
                .settledAt(entity.getSettledAt())
                .build();
    }

    /** Maps a single line item to its DTO. */
    public TransactionItemDto toItemDto(TransactionItem item) {
        return new TransactionItemDto(
                item.getId(),
                item.getProductId(),
                item.getDescriptionSnapshot(),
                item.getPriceSnapshot(),
                item.getProfessionalFee(),
                item.getBillingType(),
                item.getPersonalAccount());
    }
}
