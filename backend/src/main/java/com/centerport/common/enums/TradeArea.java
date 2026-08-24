package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Sailing area classification for Panama certificates.
 * Affects which medical standards and fitness criteria apply.
 */
public enum TradeArea {
    NEAR_COASTAL("Near-Coastal"),
    OCEANGOING("Oceangoing"),
    OTHERS("Others"),

    /** Legacy values retained so records created before migration V23 remain readable. */
    COASTAL("Coastal"),
    TROPICAL("Tropical"),
    WORLDWIDE("Worldwide");

    private final String value;

    TradeArea(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TradeArea fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (TradeArea tradeArea : values()) {
            if (tradeArea.value.equals(value)) {
                return tradeArea;
            }
        }
        throw new IllegalArgumentException("Invalid TradeArea: " + value);
    }
}
