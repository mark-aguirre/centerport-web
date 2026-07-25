package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Visual acuity assessment outcome for medical examinations.
 * Indicates whether the seafarer's vision meets standards unaided, with correction,
 * or is impaired beyond acceptable limits.
 */
public enum VisualAcuityResult {
    NORMAL("Normal"),
    WITH_CORRECTION("With Correction"),
    IMPAIRED("Impaired");

    private final String value;

    VisualAcuityResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static VisualAcuityResult fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (VisualAcuityResult v : values()) {
            if (v.value.equals(value)) {
                return v;
            }
        }
        throw new IllegalArgumentException("Invalid VisualAcuityResult: " + value);
    }
}
