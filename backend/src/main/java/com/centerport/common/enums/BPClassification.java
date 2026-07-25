package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Blood pressure classification per AHA/ACC guidelines.
 * Used in physical examination vital signs to categorize readings
 * from Normal through Hypertensive Crisis.
 */
public enum BPClassification {
    NORMAL("Normal"),
    ELEVATED("Elevated"),
    HYPERTENSION_STAGE_1("Hypertension Stage 1"),
    HYPERTENSION_STAGE_2("Hypertension Stage 2"),
    HYPERTENSIVE_CRISIS("Hypertensive Crisis");

    private final String value;

    BPClassification(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static BPClassification fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (BPClassification b : values()) {
            if (b.value.equals(value)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Invalid BPClassification: " + value);
    }
}
