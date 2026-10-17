package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Final employment recommendation issued at the conclusion of a landbase PEME.
 * Determines whether the seafarer is cleared for employment, needs restrictions,
 * or requires further evaluation.
 */
public enum RecommendationValue {
    FIT("FIT"),
    UNFIT("UNFIT"),
    FIT_TO_WORK("FIT TO WORK"),
    FIT_WITH_RESTRICTION("FIT w/ RESTRICTION"),
    FIT_FOR_EMPLOYMENT("FIT FOR EMPLOYMENT"),
    FIT_FOR_TRAINING("FIT FOR TRAINING"),
    FIT_FOR_ENROLLMENT("FIT FOR ENROLLMENT"),
    FIT_FOR_SEA_DUTY("FIT FOR SEA DUTY");

    private final String value;

    RecommendationValue(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static RecommendationValue fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (RecommendationValue r : values()) {
            if (r.value.equals(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Invalid RecommendationValue: " + value);
    }
}
