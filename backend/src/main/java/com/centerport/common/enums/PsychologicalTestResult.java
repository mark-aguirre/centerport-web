package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Outcome of a psychological fitness assessment for seafarer certification.
 * Includes an abbreviated "Rec. w/Reservation" for conditional recommendation.
 */
public enum PsychologicalTestResult {
    RECOMMENDED("Recommended"),
    RECOMMENDED_WITH_RESERVATION("Rec. w/Reservation"),
    NOT_RECOMMENDED("Not Recommended"),
    NOT_DONE("Not Done");

    private final String value;

    PsychologicalTestResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PsychologicalTestResult fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (PsychologicalTestResult p : values()) {
            if (p.value.equals(value)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid PsychologicalTestResult: " + value);
    }
}
