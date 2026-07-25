package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Vessel classification for Panama maritime certificates.
 * Determines applicable safety and medical standards.
 */
public enum ShipType {
    CONTAINER("Container"),
    TANKER("Tanker"),
    PASSENGER("Passenger"),
    OTHERS("Others");

    private final String value;

    ShipType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ShipType fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (ShipType s : values()) {
            if (s.value.equals(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Invalid ShipType: " + value);
    }
}
