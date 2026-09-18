package com.centerport.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Read-only product view over an {@link Item}, consumed by the transaction
 * workspace's product selector. Exposes only the fields needed to seed a
 * transaction item's snapshot (price + description + default professional fee).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private UUID id;
    private String productId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal professionalFee;
}
