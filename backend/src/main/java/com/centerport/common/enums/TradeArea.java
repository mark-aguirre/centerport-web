package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Maritime trade area classification for Panama certificates.
 * Affects which medical standards and fitness criteria apply.
 */
public enum TradeArea {
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
        for (TradeArea t : values()) {
            if (t.value.equals(value)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Invalid TradeArea: " + value);
    }
}
