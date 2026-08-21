package com.centerport.visit;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mutable visit details accepted when updating an existing patient visit.
 *
 * Both values may be null so a previously persisted value can be cleared.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientVisitUpdateDto {

    private String purposeOfVisit;

    @Size(max = 255, message = "sirb must not exceed 255 characters")
    private String sirb;
}
