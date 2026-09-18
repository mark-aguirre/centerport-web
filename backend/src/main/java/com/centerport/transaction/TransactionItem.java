package com.centerport.transaction;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * A single line within a {@link Transaction}.
 *
 * Stores <em>snapshots</em> of the source product's price and description at the
 * time the item was added, so historical transactions remain accurate even if
 * the item master later changes. The billing type and personal-account flag are
 * per-item, defaulting from the transaction but overridable.
 */
@Getter
@Setter
@Entity
@Table(name = "transaction_items")
public class TransactionItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "description_snapshot", nullable = false)
    private String descriptionSnapshot;

    @Column(name = "price_snapshot", nullable = false)
    private BigDecimal priceSnapshot = BigDecimal.ZERO;

    @Column(name = "professional_fee", nullable = false)
    private BigDecimal professionalFee = BigDecimal.ZERO;

    @Column(name = "billing_type", nullable = false)
    private String billingType;

    @Column(name = "personal_account", nullable = false)
    private Boolean personalAccount = false;

    @Column(name = "line_no", nullable = false)
    private Integer lineNo = 0;
}
