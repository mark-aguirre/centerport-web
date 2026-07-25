package com.centerport.panama;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Value object representing a laboratory test result in a Panama certificate.
 * Stored as part of a JSONB map in the lab_tests column.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTestResult {

    private String normal;
    private String abnormal;
    private String observations;
}
