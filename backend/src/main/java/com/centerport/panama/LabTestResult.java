package com.centerport.panama;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Value object representing a laboratory test result in a Panama certificate.
 * Includes a checked flag indicating whether the test was performed/selected.
 * Stored as part of a JSONB map in the lab_tests column.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTestResult {

    private String normal;
    private String abnormal;
    private String observations;
    private Boolean checked;

    /**
     * Backward-compatible constructor without the {@code checked} flag.
     * Leaves {@code checked} null so existing callers and stored JSONB records
     * (which predate the checkbox field) continue to work unchanged.
     */
    public LabTestResult(String normal, String abnormal, String observations) {
        this.normal = normal;
        this.abnormal = abnormal;
        this.observations = observations;
    }
}
