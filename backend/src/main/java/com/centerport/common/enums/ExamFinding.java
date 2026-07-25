package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Binary finding for a physical examination system (e.g., skin, HEENT, chest/lungs).
 * Indicates whether the system was found normal or abnormal during examination.
 */
public enum ExamFinding {
    NORMAL("normal"),
    ABNORMAL("abnormal");

    private final String value;

    ExamFinding(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ExamFinding fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (ExamFinding e : values()) {
            if (e.value.equals(value)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Invalid ExamFinding: " + value);
    }
}
