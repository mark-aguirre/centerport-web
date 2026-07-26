package com.centerport.mlc;

import com.centerport.common.entity.BaseEntity;
import com.centerport.common.enums.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

/**
 * JPA entity representing an MLC (Maritime Labour Convention) medical certificate record.
 *
 * Stores the full dataset for a seafarer's MLC-compliant medical examination
 * including personal information, seafarer details, certificate metadata,
 * physician declarations on fitness standards, and the final recommendation.
 *
 * Persistence:
 * Mapped to the {@code mlc_records} table. Inherits UUID primary key and
 * automatic timestamp management (createdDate, updatedDate) from
 * {@link com.centerport.common.BaseEntity}.
 *
 * Business ID:
 * The {@code mlcId} field holds a human-readable sequential identifier
 * (e.g., {@code MLC00000001}) generated at creation time via
 * {@link com.centerport.common.util.BusinessIdGenerator}.
 *
 * JSON Columns:
 * The {@code visualAids} field is stored as JSONB in PostgreSQL and mapped
 * via Hibernate's {@code @JdbcTypeCode(SqlTypes.JSON)}.
 *
 * @see com.centerport.common.BaseEntity
 * @see MlcRecordService
 */
@Getter
@Setter
@Entity
@Table(name = "mlc_records")
public class MlcRecord extends BaseEntity {

    @Column(name = "mlc_id", unique = true)
    private String mlcId;

    // --- Personal Information ---
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "passport_no")
    private String passportNo;

    @Column(name = "religion")
    private String religion;

    @Column(name = "nationality")
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "civil_status")
    private CivilStatus civilStatus;

    @Column(name = "address")
    private String address;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "employer")
    private String employer;

    @Column(name = "position")
    private String position;

    // --- Additional Seafarer Details ---
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "age")
    private String age;

    @Column(name = "sirb_no")
    private String sirbNo;

    @Column(name = "rank")
    private String rank;

    @Column(name = "vessel_name")
    private String vesselName;

    @Column(name = "vessel_type")
    private String vesselType;

    @Column(name = "shipping_company")
    private String shippingCompany;

    @Column(name = "manning_agency")
    private String manningAgency;

    // --- Certificate Details ---
    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type")
    private CertificateType certificateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_determination")
    private FitnessDetermination fitnessDetermination;

    @Column(name = "date_of_examination")
    private String dateOfExamination;

    @Column(name = "date_issued")
    private String dateIssued;

    @Column(name = "valid_until")
    private String validUntil;

    @Column(name = "issuing_authority")
    private String issuingAuthority;

    @Column(name = "examining_physician")
    private String examiningPhysician;

    @Column(name = "medical_director")
    private String medicalDirector;

    @Column(name = "limitations_remarks")
    private String limitationsRemarks;

    // --- Declaration of the Authorized Physician ---
    @Enumerated(EnumType.STRING)
    @Column(name = "id_documents_checked")
    private YesNo idDocumentsChecked;

    @Enumerated(EnumType.STRING)
    @Column(name = "hearing_meets_standards")
    private YesNo hearingMeetsStandards;

    @Enumerated(EnumType.STRING)
    @Column(name = "unaided_hearing_satisfactory")
    private YesNo unaidedHearingSatisfactory;

    @Enumerated(EnumType.STRING)
    @Column(name = "visual_acuity_meets_standards")
    private YesNo visualAcuityMeetsStandards;

    @Enumerated(EnumType.STRING)
    @Column(name = "colour_vision_meets_standards")
    private YesNo colourVisionMeetsStandards;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "visual_aids", columnDefinition = "jsonb")
    private List<VisualAid> visualAids;

    @Column(name = "date_colour_vision_test")
    private String dateColourVisionTest;

    @Enumerated(EnumType.STRING)
    @Column(name = "fit_for_lookout")
    private YesNo fitForLookout;

    @Enumerated(EnumType.STRING)
    @Column(name = "no_limitations")
    private YesNo noLimitations;

    @Column(name = "limitations_details")
    private String limitationsDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "applicant_condition_risk")
    private YesNo applicantConditionRisk;

    // --- Final Recommendation ---
    @Column(name = "date_initial_peme")
    private String dateInitialPeme;

    @Column(name = "date_of_fitness")
    private String dateOfFitness;

    @Column(name = "valid_until_date")
    private String validUntilDate;

    @Column(name = "medical_certification_no")
    private String medicalCertificationNo;
}
