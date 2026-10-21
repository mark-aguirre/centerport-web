package com.centerport.hiv;

import com.centerport.common.entity.BaseEntity;
import com.centerport.profile.SeafarerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * HIV Report entity representing a Human Immunodeficiency Virus (HIV-1)
 * screening test result.
 *
 * Captures the report header (medical technologist, pathologist, examining
 * physician, their license/certificate numbers, result and expiry dates) and
 * the HIV screening section: the screening test(s) used (RAPID, particle
 * agglutination, EIA/CMA/ELFA, or an "others" free-text) and the reactive
 * result.
 *
 * Each report is linked to a {@link SeafarerProfile} for patient identity and
 * assigned a unique business ID (format: {@code HIV00000001}) generated from
 * the {@code hiv_seq} PostgreSQL sequence.
 *
 * @see SeafarerProfile
 * @see HivReportService
 * @see HivReportRepository
 */
@Getter
@Setter
@Entity
@Table(name = "hiv_reports")
public class HivReport extends BaseEntity {

    @Column(name = "report_id", unique = true)
    private String reportId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Report Header ---
    @Column(name = "med_tech")
    private String medTech;

    @Column(name = "hiv_proficiency_cert_no")
    private String hivProficiencyCertNo;

    @Column(name = "pathologist")
    private String pathologist;

    @Column(name = "pathologist_license_no")
    private String pathologistLicenseNo;

    @Column(name = "examining_physician")
    private String examiningPhysician;

    @Column(name = "physician_license_no")
    private String physicianLicenseNo;

    @Column(name = "result_date")
    private String resultDate;

    @Column(name = "expire_date")
    private String expireDate;

    // ======================================================================
    // HIV (HIV-1) SCREEN TEST
    // ======================================================================

    /** Screening test used — RAPID. */
    @Column(name = "test_rapid")
    private Boolean testRapid;

    /** Screening test used — Particle Agglutination. */
    @Column(name = "test_particle_agglutination")
    private Boolean testParticleAgglutination;

    /** Screening test used — EIA/CMA/ELFA. */
    @Column(name = "test_eia_cma_elfa")
    private Boolean testEiaCmaElfa;

    /** Screening test used — Others (free text). */
    @Column(name = "test_others")
    private String testOthers;

    /** Screening result (e.g. "reactive" / "non_reactive"). */
    @Column(name = "result")
    private String result;
}
