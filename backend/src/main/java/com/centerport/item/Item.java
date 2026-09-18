package com.centerport.item;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Billable item entity — a service, laboratory examination, package, or any
 * other chargeable line managed through the Item Listing page. Items also serve
 * as the product catalog for the transaction workspace.
 *
 * The {@code itemId} is a human-readable business identifier generated
 * server-side (format: {@code ITM} + 8-digit padded number).
 *
 * @see com.centerport.common.entity.BaseEntity inherited audit fields (id, createdDate, updatedDate)
 * @see ItemService business logic
 */
@Getter
@Setter
@Entity
@Table(name = "items")
public class Item extends BaseEntity {

    @Column(name = "item_id", unique = true)
    private String itemId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "professional_fee", nullable = false)
    private BigDecimal professionalFee = BigDecimal.ZERO;

    @Column(name = "is_package", nullable = false)
    private Boolean isPackage = false;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
