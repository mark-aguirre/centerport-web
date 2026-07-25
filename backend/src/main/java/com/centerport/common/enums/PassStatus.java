package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Overall pass/fail status for a group of examination results (e.g., basic PEME,
 * additional labs, flag medical lab). Indicates whether findings are clinically significant.
 */
public enum PassStatus {
    PASSED("passed"),
    WITH_SIGNIFICANT_FINDINGS("with_significant_findings");

    private final String value;

    PassStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PassStatus fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (PassStatus p : values()) {
            if (p.value.equals(value)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid PassStatus: " + value);
    }
}
