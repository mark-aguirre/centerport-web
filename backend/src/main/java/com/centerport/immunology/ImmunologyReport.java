package com.centerport.immunology;

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
 * Immunology Report entity representing a set of serology/immunology test results.
 *
 * Captures immunology-section results such as PSA, a free-form "other" test,
 * HBsAg, RPR, and Anti-HBs (with cut-off and result line).
 *
 * Each report is linked to a {@link SeafarerProfile} for patient identity and
 * assigned a unique business ID (format: {@code IMM00000001}) generated from
 * the {@code imm_seq} PostgreSQL sequence.
 *
 * @see SeafarerProfile
 * @see ImmunologyReportService
 * @see ImmunologyReportRepository
 */
@Getter
@Setter
@Entity
@Table(name = "immunology_reports")
public class ImmunologyReport extends BaseEntity {

    @Column(name = "report_id", unique = true)
    private String reportId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Report Header ---
    @Column(name = "result_date")
    private String resultDate;

    @Column(name = "med_tech")
    private String medTech;

    @Column(name = "med_tech_license_no")
    private String medTechLicenseNo;

    @Column(name = "pathologist")
    private String pathologist;

    @Column(name = "pathologist_license_no")
    private String pathologistLicenseNo;

    @Column(name = "laboratory_no")
    private String laboratoryNo;

    // ======================================================================
    // IMMUNOLOGY / SEROLOGY TESTS
    // ======================================================================

    @Column(name = "psa_reference")
    private String psaReference;

    @Column(name = "psa_result")
    private String psaResult;

    @Column(name = "other_test_name")
    private String otherTestName;

    @Column(name = "other_reference")
    private String otherReference;

    @Column(name = "other_result")
    private String otherResult;

    @Column(name = "hbsag_result")
    private String hbsagResult;

    @Column(name = "rpr_result")
    private String rprResult;

    @Column(name = "anti_hbs_result")
    private String antiHbsResult;

    @Column(name = "anti_hbs_cut_off")
    private String antiHbsCutOff;

    @Column(name = "anti_hbs_result_line")
    private String antiHbsResultLine;
}
