package com.centerport.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for {@link TransactionItem}, used by the receivables report to read
 * line items of settled transactions.
 */
public interface TransactionItemRepository extends JpaRepository<TransactionItem, UUID> {

    /**
     * Finds line items of SETTLED transactions within a settled-at date range,
     * optionally filtered by billing type. Ordered by settlement time.
     *
     * <p>The account (customer/agency) and package filters are applied by the
     * service after joining product/customer data, keeping this query focused.
     *
     * @param from        inclusive lower bound on the transaction's settledAt
     * @param to          inclusive upper bound on the transaction's settledAt
     * @param billingType optional billing type; when null, all types are returned
     * @return matching settled line items with their transaction eagerly available
     */
    @Query("""
            SELECT ti FROM TransactionItem ti
            JOIN ti.transaction t
            WHERE t.status = com.centerport.transaction.TransactionStatus.SETTLED
              AND t.settledAt >= :from
              AND t.settledAt <= :to
              AND (:billingType IS NULL OR ti.billingType = :billingType)
            ORDER BY t.settledAt DESC
            """)
    List<TransactionItem> findSettledItems(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("billingType") String billingType);
}
