package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Status of an individual laboratory test within a medical examination.
 * Includes a pending state for tests awaiting results.
 */
public enum LabStatus {
    NORMAL("normal"),
    WITH_FINDINGS("with_findings"),
    PENDING("pending");

    private final String value;

    LabStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static LabStatus fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (LabStatus l : values()) {
            if (l.value.equals(value)) {
                return l;
            }
        }
        throw new IllegalArgumentException("Invalid LabStatus: " + value);
    }
}
