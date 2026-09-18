package com.centerport.transaction;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A point-of-sale transaction (sale/charge) against a customer.
 *
 * <p>Named after the transaction rather than "receivable": a receivable is a
 * reporting view over the Billed Agency amounts of settled transactions, not a
 * separate persisted entity. A transaction is persisted only once settled and,
 * once settled, is never physically deleted — it can only be voided.
 *
 * @see TransactionItem the line-item snapshots
 */
@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    /** The billed customer — a seafarer profile UUID. */
    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.DRAFT;

    @Column(name = "default_billing_type", nullable = false)
    private String defaultBillingType;

    @Column(name = "default_professional_fee", nullable = false)
    private BigDecimal defaultProfessionalFee = BigDecimal.ZERO;

    /** Authoritative total computed and validated server-side on settle. */
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @Column(name = "voided_at")
    private LocalDateTime voidedAt;

    @Column(name = "void_reason")
    private String voidReason;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("lineNo ASC")
    private List<TransactionItem> items = new ArrayList<>();

    /**
     * Adds an item to this transaction, wiring the back-reference and line
     * order so the aggregate stays consistent.
     */
    public void addItem(TransactionItem item) {
        item.setTransaction(this);
        item.setLineNo(this.items.size());
        this.items.add(item);
    }
}
