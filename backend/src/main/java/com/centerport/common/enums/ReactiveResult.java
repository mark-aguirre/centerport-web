package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Reactive/non-reactive result for serological tests (e.g., HBsAg, HIV, RPR/APB).
 */
public enum ReactiveResult {
    REACTIVE("reactive"),
    NON_REACTIVE("non_reactive");

    private final String value;

    ReactiveResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ReactiveResult fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (ReactiveResult r : values()) {
            if (r.value.equals(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Invalid ReactiveResult: " + value);
    }
}
