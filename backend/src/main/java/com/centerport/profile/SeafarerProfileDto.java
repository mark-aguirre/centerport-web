package com.centerport.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for SeafarerProfile.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields
 * ({@code id}, {@code profileId}, {@code createdDate}, {@code updatedDate})
 * are included in response output but ignored on create/update input.
 *
 * Validation:
 * - {@code lastName} is required (must not be blank)
 *
 * @see SeafarerProfile the corresponding entity
 * @see SeafarerProfileMapper entity/DTO conversion
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeafarerProfileDto {

    private UUID id;
    private String profileId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private String createdBy;
    private String photoUrl;

    @NotBlank(message = "must not be blank")
    private String lastName;
    private String firstName;
    private String middleName;
    private String address;
    private String city;
    private String contactNo;
    private String birthdate;
    private String age;
    private String gender;
    private String maritalStatus;
    private String placeOfBirth;
    private String religion;
    private String nationality;
    private String country;
    private String employer;
    private String designation;
    private String passportNo;
    private String seamansBookNo;
    private String position;
    private String countryOfDestination;
    private String fatherName;
    private String fatherOccupation;
    private String motherName;
    private String motherOccupation;
    private String noOfBrothers;
    private String noOfSisters;
    private String birthOrder;
    private String spouseName;
    private String spouseOccupation;
    private String noOfChildren;
    private String elementary;
    private String highSchool;
    private String collegeUniversity;
    private String course;
    private String highestLevelAttended;
    private String prevDateStarted;
    private String prevDateEnd;
    private String prevLengthOfStay;
    private String prevCompany;
    private String prevPosition;
    private String prevReasonOfLeaving;
    private String remark;
}
