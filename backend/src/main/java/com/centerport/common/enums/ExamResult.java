package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Outcome of an ancillary examination (e.g., CBC, urinalysis, chest X-ray).
 * Indicates whether results are normal or include findings requiring attention.
 */
public enum ExamResult {
    NORMAL("normal"),
    WITH_FINDINGS("with_findings");

    private final String value;

    ExamResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ExamResult fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (ExamResult e : values()) {
            if (e.value.equals(value)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Invalid ExamResult: " + value);
    }
}
