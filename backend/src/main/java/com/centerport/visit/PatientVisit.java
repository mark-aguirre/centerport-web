package com.centerport.visit;

import com.centerport.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Patient visit record linking a seafarer profile to a clinic visit.
 *
 * Each time a patient visits the clinic, a new record is created here.
 * The profile data lives in {@code seafarer_profiles}; this table only
 * stores visit-specific metadata (purpose, SIRB, date).
 *
 * @see com.centerport.profile.SeafarerProfile the linked patient profile
 */
@Getter
@Setter
@Entity
@Table(name = "patient_visits")
public class PatientVisit extends BaseEntity {

    @Column(name = "visit_id", unique = true)
    private String visitId;

    @Column(name = "seafarer_profile_id", nullable = false)
    private UUID seafarerProfileId;

    @Column(name = "purpose_of_visit")
    private String purposeOfVisit;

    @Column(name = "sirb")
    private String sirb;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;
}
