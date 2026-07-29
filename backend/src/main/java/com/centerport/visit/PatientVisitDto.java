package com.centerport.visit;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for PatientVisit.
 *
 * On create input, only {@code seafarerProfileId} is required.
 * System fields (id, visitId, timestamps) are populated server-side.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientVisitDto {

    private UUID id;
    private String visitId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @NotNull(message = "seafarerProfileId must not be null")
    private UUID seafarerProfileId;

    private String purposeOfVisit;
    private String sirb;
    private LocalDate visitDate;

    // --- Joined profile fields for list display (read-only) ---
    private String profileId;
    private String photoUrl;
    private String lastName;
    private String firstName;
    private String middleName;
    private String gender;
    private String employer;
    private String position;
}
