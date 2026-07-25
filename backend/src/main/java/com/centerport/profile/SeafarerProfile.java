package com.centerport.profile;

import com.centerport.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Seafarer profile entity containing personal, employment, family, and education data.
 * All data fields are stored as strings to match the frontend TypeScript interface.
 */
@Getter
@Setter
@Entity
@Table(name = "seafarer_profiles")
public class SeafarerProfile extends BaseEntity {

    @Column(name = "profile_id", unique = true)
    private String profileId;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "birthdate")
    private String birthdate;

    @Column(name = "age")
    private String age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "religion")
    private String religion;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "country")
    private String country;

    @Column(name = "employer")
    private String employer;

    @Column(name = "designation")
    private String designation;

    @Column(name = "passport_no")
    private String passportNo;

    @Column(name = "seamans_book_no")
    private String seamansBookNo;

    @Column(name = "position")
    private String position;

    @Column(name = "country_of_destination")
    private String countryOfDestination;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "father_occupation")
    private String fatherOccupation;

    @Column(name = "mother_name")
    private String motherName;

    @Column(name = "mother_occupation")
    private String motherOccupation;

    @Column(name = "no_of_brothers")
    private String noOfBrothers;

    @Column(name = "no_of_sisters")
    private String noOfSisters;

    @Column(name = "birth_order")
    private String birthOrder;

    @Column(name = "spouse_name")
    private String spouseName;

    @Column(name = "spouse_occupation")
    private String spouseOccupation;

    @Column(name = "no_of_children")
    private String noOfChildren;

    @Column(name = "elementary")
    private String elementary;

    @Column(name = "high_school")
    private String highSchool;

    @Column(name = "college_university")
    private String collegeUniversity;

    @Column(name = "course")
    private String course;

    @Column(name = "highest_level_attended")
    private String highestLevelAttended;

    @Column(name = "prev_date_started")
    private String prevDateStarted;

    @Column(name = "prev_date_end")
    private String prevDateEnd;

    @Column(name = "prev_length_of_stay")
    private String prevLengthOfStay;

    @Column(name = "prev_company")
    private String prevCompany;

    @Column(name = "prev_position")
    private String prevPosition;

    @Column(name = "prev_reason_of_leaving")
    private String prevReasonOfLeaving;

    @Column(name = "remark")
    private String remark;
}
