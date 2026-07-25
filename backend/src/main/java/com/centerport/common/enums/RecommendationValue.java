package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Final employment recommendation issued at the conclusion of a landbase PEME.
 * Determines whether the seafarer is cleared for employment, needs restrictions,
 * or requires further evaluation.
 */
public enum RecommendationValue {
    FIT_FOR_EMPLOYMENT("Fit for Employment"),
    UNFIT_FOR_EMPLOYMENT("Unfit for Employment"),
    REQUIRES_FURTHER_EVALUATION("Requires Further Evaluation"),
    TEMPORARILY_UNFIT("Temporarily Unfit"),
    FIT_WITH_RESTRICTION("Fit with Restriction");

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
