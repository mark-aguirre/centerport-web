package com.centerport.xray;

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
 * X-Ray Report entity representing a radiology chest/skeletal x-ray result.
 *
 * Captures the report header (result date, x-ray technologist and radiologist
 * with their license numbers) and the x-ray result section: the x-ray
 * reference number, the radiology findings narrative, and the radiologist's
 * impression.
 *
 * Each report is linked to a {@link SeafarerProfile} for patient identity and
 * assigned a unique business ID (format: {@code XRAY00000001}) generated from
 * the {@code xray_seq} PostgreSQL sequence.
 *
 * @see SeafarerProfile
 * @see XrayReportService
 * @see XrayReportRepository
 */
@Getter
@Setter
@Entity
@Table(name = "xray_reports")
public class XrayReport extends BaseEntity {

    @Column(name = "report_id", unique = true)
    private String reportId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Report Header ---
    @Column(name = "result_date")
    private String resultDate;

    @Column(name = "xray_tech")
    private String xrayTech;

    @Column(name = "xray_tech_license_no")
    private String xrayTechLicenseNo;

    @Column(name = "radiologist")
    private String radiologist;

    @Column(name = "radiologist_license_no")
    private String radiologistLicenseNo;

    // ======================================================================
    // X-RAY RESULT
    // ======================================================================

    /** X-Ray reference number assigned by the radiology section. */
    @Column(name = "xray_no")
    private String xrayNo;

    /** Free-text radiology findings narrative. */
    @Column(name = "radiology_findings", columnDefinition = "TEXT")
    private String radiologyFindings;

    /** Free-text radiologist's impression. */
    @Column(name = "impression", columnDefinition = "TEXT")
    private String impression;
}
