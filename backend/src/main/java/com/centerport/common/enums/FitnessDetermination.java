package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Final fitness-for-duty determination issued on a maritime medical certificate.
 * Ranges from fully fit to permanently unfit for sea service.
 */
public enum FitnessDetermination {
    FIT_FOR_SEA_DUTY("Fit for Sea Duty"),
    FIT_WITH_RESTRICTIONS("Fit with Restrictions"),
    TEMPORARILY_UNFIT("Temporarily Unfit"),
    UNFIT_FOR_SEA_SERVICE("Unfit for Sea Service");

    private final String value;

    FitnessDetermination(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static FitnessDetermination fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (FitnessDetermination f : values()) {
            if (f.value.equals(value)) {
                return f;
            }
        }
        throw new IllegalArgumentException("Invalid FitnessDetermination: " + value);
    }
}
