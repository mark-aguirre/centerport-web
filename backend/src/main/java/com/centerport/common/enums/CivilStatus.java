package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Marital/civil status of a seafarer, recorded as part of personal information.
 */
public enum CivilStatus {
    SINGLE("Single"),
    MARRIED("Married"),
    WIDOWED("Widowed"),
    SEPARATED("Separated");

    private final String value;

    CivilStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CivilStatus fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (CivilStatus c : values()) {
            if (c.value.equals(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Invalid CivilStatus: " + value);
    }
}
