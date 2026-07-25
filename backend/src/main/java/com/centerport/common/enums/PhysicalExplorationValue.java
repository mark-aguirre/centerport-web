package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Normal/Abnormal indicator for Panama certificate physical exploration items.
 * Serialized as single-character codes: {@code "N"} for Normal, {@code "A"} for Abnormal.
 */
public enum PhysicalExplorationValue {
    NORMAL("N"),
    ABNORMAL("A");

    private final String value;

    PhysicalExplorationValue(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PhysicalExplorationValue fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (PhysicalExplorationValue p : values()) {
            if (p.value.equals(value)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid PhysicalExplorationValue: " + value);
    }
}
