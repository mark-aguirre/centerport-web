package com.centerport.mlc;

import com.centerport.common.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Data transfer object for MLC (Maritime Labour Convention) records.
 *
 * Carries the full MLC certificate dataset between the REST layer and
 * the service layer. All field names serialize to snake_case via the
 * global {@code JacksonConfig}.
 *
 * System Fields:
 * The fields {@code id}, {@code mlcId}, {@code createdDate}, and
 * {@code updatedDate} are included in responses but ignored on
 * create/update input — the server manages these values.
 *
 * Validation:
 * {@code lastName} is the only required field (enforced via
 * {@code @NotBlank}). All other fields are optional.
 *
 * Field Groups:
 * - Personal Information (name, demographics, contact)
 * - Additional Seafarer Details (vessel, rank, agency)
 * - Certificate Details (type, fitness, dates, authority)
 * - Declaration of the Authorized Physician (standards compliance)
 * - Final Recommendation (certification dates)
 *
 * @see MlcRecord
 * @see MlcRecordMapper
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MlcRecordDto {

    private UUID id;
    private String mlcId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- Personal Information ---
    @NotBlank(message = "must not be blank")
    private String lastName;
    private String firstName;
    private String middleName;
    private String placeOfBirth;
    private String passportNo;
    private String religion;
    private String nationality;
    private Gender gender;
    private CivilStatus civilStatus;
    private String address;
    private String contactNo;
    private String employer;
    private String position;

    // --- Additional Seafarer Details ---
    private String dateOfBirth;
    private String age;
    private String sirbNo;
    private String rank;
    private String vesselName;
    private String vesselType;
    private String shippingCompany;
    private String manningAgency;

    // --- Certificate Details ---
    private CertificateType certificateType;
    private FitnessDetermination fitnessDetermination;
    private String dateOfExamination;
    private String dateIssued;
    private String validUntil;
    private String issuingAuthority;
    private String examiningPhysician;
    private String medicalDirector;
    private String limitationsRemarks;

    // --- Declaration of the Authorized Physician ---
    private YesNo idDocumentsChecked;
    private YesNo hearingMeetsStandards;
    private YesNo unaidedHearingSatisfactory;
    private YesNo visualAcuityMeetsStandards;
    private YesNo colourVisionMeetsStandards;
    private List<VisualAid> visualAids;
    private String dateColourVisionTest;
    private YesNo fitForLookout;
    private YesNo noLimitations;
    private String limitationsDetails;
    private YesNo applicantConditionRisk;

    // --- Final Recommendation ---
    private String dateInitialPeme;
    private String dateOfFitness;
    private String validUntilDate;
    private String medicalCertificationNo;
}
