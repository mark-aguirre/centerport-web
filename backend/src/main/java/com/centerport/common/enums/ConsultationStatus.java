package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Tracks the lifecycle state of a medical consultation or follow-up action
 * within a medical examination record.
 */
public enum ConsultationStatus {
    FOR_FOLLOW_UP("For Follow-up"),
    CLEARED("Cleared"),
    REFERRED("Referred"),
    PENDING("Pending");

    private final String value;

    ConsultationStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ConsultationStatus fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (ConsultationStatus c : values()) {
            if (c.value.equals(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Invalid ConsultationStatus: " + value);
    }
}
