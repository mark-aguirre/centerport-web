package com.centerport.panama;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Value object representing an "other" laboratory test result in a Panama certificate.
 * Includes a checked flag indicating whether the test was performed.
 * Stored as part of a JSONB map in the lab_other_tests column.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtherLabTestResult {

    private Boolean checked;
    private String normal;
    private String abnormal;
    private String observations;
}
