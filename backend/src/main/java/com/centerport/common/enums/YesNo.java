package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Simple yes/no answer type used in questionnaires and physician declarations.
 * Serialized as lowercase strings ({@code "yes"}, {@code "no"}).
 */
public enum YesNo {
    YES("yes"),
    NO("no");

    private final String value;

    YesNo(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static YesNo fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (YesNo y : values()) {
            if (y.value.equals(value)) {
                return y;
            }
        }
        throw new IllegalArgumentException("Invalid YesNo: " + value);
    }
}
