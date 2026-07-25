package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Type of visual aid required or used by a seafarer.
 * Recorded in MLC physician declarations when visual standards are met with correction.
 */
public enum VisualAid {
    SPECTACLES("spectacles"),
    CONTACT_LENSES("contact_lenses"),
    NONE("none");

    private final String value;

    VisualAid(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static VisualAid fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (VisualAid v : values()) {
            if (v.value.equals(value)) {
                return v;
            }
        }
        throw new IllegalArgumentException("Invalid VisualAid: " + value);
    }
}
