package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Pregnancy test outcome for female seafarers during pre-employment examination.
 * Includes a {@code N/A} value for male or non-applicable cases.
 */
public enum PregnancyTestResult {
    NOT_APPLICABLE("N/A"),
    POSITIVE("Positive"),
    NEGATIVE("Negative");

    private final String value;

    PregnancyTestResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PregnancyTestResult fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (PregnancyTestResult p : values()) {
            if (p.value.equals(value)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid PregnancyTestResult: " + value);
    }
}
