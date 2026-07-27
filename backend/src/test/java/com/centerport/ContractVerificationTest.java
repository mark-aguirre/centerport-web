package com.centerport;

import com.centerport.common.enums.*;
import com.centerport.config.JacksonConfig;
import com.centerport.landbase.LandbasePemeDto;
import com.centerport.medical.MedicalExamDto;
import com.centerport.mlc.MlcRecordDto;
import com.centerport.panama.*;
import com.centerport.profile.SeafarerProfileDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Contract verification tests ensuring serialized DTO field names and enum literals
 * match the frontend TypeScript interfaces exactly.
 *
 * Requirements validated: 2.5, 3.1
 */
@DisplayName("Contract Verification")
class ContractVerificationTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new JacksonConfig().objectMapper();
    }

    @Nested
    @DisplayName("SeafarerProfileDto field names")
    class SeafarerProfileContract {

        @Test
        @DisplayName("serializes all fields to expected snake_case names")
        void shouldSerializeToExpectedSnakeCaseFields() throws Exception {
            SeafarerProfileDto dto = new SeafarerProfileDto();
            dto.setId(UUID.randomUUID());
            dto.setProfileId("CMSI00000001");
            dto.setCreatedDate(LocalDateTime.now());
            dto.setUpdatedDate(LocalDateTime.now());
            dto.setCreatedBy("admin");
            dto.setPhotoUrl("http://photo.jpg");
            dto.setLastName("Cruz");
            dto.setFirstName("Juan");
            dto.setMiddleName("Santos");
            dto.setAddress("123 Main");
            dto.setCity("Manila");
            dto.setContactNo("09171234567");
            dto.setBirthdate("1990-01-01");
            dto.setAge("34");
            dto.setGender("Male");
            dto.setMaritalStatus("Single");
            dto.setPlaceOfBirth("Quezon City");
            dto.setReligion("Catholic");
            dto.setNationality("Filipino");
            dto.setCountry("Philippines");
            dto.setEmployer("Maersk");
            dto.setDesignation("Officer");
            dto.setPassportNo("P12345678");
            dto.setSeamansBookNo("SB12345");
            dto.setPosition("Captain");
            dto.setCountryOfDestination("Singapore");
            dto.setFatherName("Pedro");
            dto.setFatherOccupation("Engineer");
            dto.setMotherName("Maria");
            dto.setMotherOccupation("Teacher");
            dto.setNoOfBrothers("2");
            dto.setNoOfSisters("1");
            dto.setBirthOrder("1");
            dto.setSpouseName("Ana");
            dto.setSpouseOccupation("Nurse");
            dto.setNoOfChildren("3");
            dto.setElementary("School A");
            dto.setHighSchool("School B");
            dto.setCollegeUniversity("University C");
            dto.setCourse("BSMT");
            dto.setHighestLevelAttended("College");
            dto.setPrevDateStarted("2020-01-01");
            dto.setPrevDateEnd("2022-12-31");
            dto.setPrevLengthOfStay("3 years");
            dto.setPrevCompany("Company X");
            dto.setPrevPosition("AB");
            dto.setPrevReasonOfLeaving("Contract end");
            dto.setRemark("None");

            String json = objectMapper.writeValueAsString(dto);

            // Verify all expected frontend snake_case field names
            assertThat(json).contains("\"id\"");
            assertThat(json).contains("\"profile_id\"");
            assertThat(json).contains("\"created_date\"");
            assertThat(json).contains("\"updated_date\"");
            assertThat(json).contains("\"created_by\"");
            assertThat(json).contains("\"photo_url\"");
            assertThat(json).contains("\"last_name\"");
            assertThat(json).contains("\"first_name\"");
            assertThat(json).contains("\"middle_name\"");
            assertThat(json).contains("\"address\"");
            assertThat(json).contains("\"city\"");
            assertThat(json).contains("\"contact_no\"");
            assertThat(json).contains("\"birthdate\"");
            assertThat(json).contains("\"age\"");
            assertThat(json).contains("\"gender\"");
            assertThat(json).contains("\"marital_status\"");
            assertThat(json).contains("\"place_of_birth\"");
            assertThat(json).contains("\"religion\"");
            assertThat(json).contains("\"nationality\"");
            assertThat(json).contains("\"country\"");
            assertThat(json).contains("\"employer\"");
            assertThat(json).contains("\"designation\"");
            assertThat(json).contains("\"passport_no\"");
            assertThat(json).contains("\"seamans_book_no\"");
            assertThat(json).contains("\"position\"");
            assertThat(json).contains("\"country_of_destination\"");
            assertThat(json).contains("\"father_name\"");
            assertThat(json).contains("\"father_occupation\"");
            assertThat(json).contains("\"mother_name\"");
            assertThat(json).contains("\"mother_occupation\"");
            assertThat(json).contains("\"no_of_brothers\"");
            assertThat(json).contains("\"no_of_sisters\"");
            assertThat(json).contains("\"birth_order\"");
            assertThat(json).contains("\"spouse_name\"");
            assertThat(json).contains("\"spouse_occupation\"");
            assertThat(json).contains("\"no_of_children\"");
            assertThat(json).contains("\"elementary\"");
            assertThat(json).contains("\"high_school\"");
            assertThat(json).contains("\"college_university\"");
            assertThat(json).contains("\"course\"");
            assertThat(json).contains("\"highest_level_attended\"");
            assertThat(json).contains("\"prev_date_started\"");
            assertThat(json).contains("\"prev_date_end\"");
            assertThat(json).contains("\"prev_length_of_stay\"");
            assertThat(json).contains("\"prev_company\"");
            assertThat(json).contains("\"prev_position\"");
            assertThat(json).contains("\"prev_reason_of_leaving\"");
            assertThat(json).contains("\"remark\"");

            // Verify no camelCase leaks
            assertThat(json).doesNotContain("profileId");
            assertThat(json).doesNotContain("createdDate");
            assertThat(json).doesNotContain("updatedDate");
            assertThat(json).doesNotContain("lastName");
            assertThat(json).doesNotContain("firstName");
            assertThat(json).doesNotContain("maritalStatus");
            assertThat(json).doesNotContain("placeOfBirth");
            assertThat(json).doesNotContain("seamansBookNo");
            assertThat(json).doesNotContain("countryOfDestination");
            assertThat(json).doesNotContain("noOfBrothers");
        }
    }

    @Nested
    @DisplayName("MedicalExamDto field names")
    class MedicalExamContract {

        @Test
        @DisplayName("serializes key fields to expected snake_case names")
        void shouldSerializeToExpectedSnakeCaseFields() throws Exception {
            MedicalExamDto dto = new MedicalExamDto();
            dto.setId(UUID.randomUUID());
            dto.setExamId("MED00000001");
            dto.setCreatedDate(LocalDateTime.now());
            dto.setUpdatedDate(LocalDateTime.now());
            dto.setSeafarerProfileId(UUID.randomUUID());
            dto.setFindingsA(Map.of("item1", true));
            dto.setFindingsB(Map.of("item2", false));
            dto.setFindingsC(Map.of("item3", true));
            dto.setQuestionnaire(Map.of("q1", "yes"));
            dto.setMedicalHistory(Map.of("diabetes", "no"));
            dto.setBpClassification(BPClassification.NORMAL);
            dto.setChestLungs(ExamFinding.NORMAL);

            String json = objectMapper.writeValueAsString(dto);

            assertThat(json).contains("\"exam_id\"");
            assertThat(json).contains("\"created_date\"");
            assertThat(json).contains("\"updated_date\"");
            assertThat(json).contains("\"seafarer_profile_id\"");
            assertThat(json).contains("\"findings_a\"");
            assertThat(json).contains("\"findings_b\"");
            assertThat(json).contains("\"findings_c\"");
            assertThat(json).contains("\"questionnaire\"");
            assertThat(json).contains("\"medical_history\"");
            assertThat(json).contains("\"bp_classification\"");
            assertThat(json).contains("\"chest_lungs\"");

            // Verify no camelCase leaks
            assertThat(json).doesNotContain("examId");
            assertThat(json).doesNotContain("seafarerProfileId");
            assertThat(json).doesNotContain("findingsA");
            assertThat(json).doesNotContain("findingsB");
            assertThat(json).doesNotContain("findingsC");
            assertThat(json).doesNotContain("bpClassification");
            assertThat(json).doesNotContain("chestLungs");
            assertThat(json).doesNotContain("medicalHistory");
        }
    }

    @Nested
    @DisplayName("LandbasePemeDto field names")
    class LandbasePemeContract {

        @Test
        @DisplayName("serializes key fields to expected snake_case names")
        void shouldSerializeToExpectedSnakeCaseFields() throws Exception {
            LandbasePemeDto dto = new LandbasePemeDto();
            dto.setId(UUID.randomUUID());
            dto.setPemeId("PEME00000001");
            dto.setCreatedDate(LocalDateTime.now());
            dto.setUpdatedDate(LocalDateTime.now());
            dto.setSeafarerProfileId(UUID.randomUUID());
            dto.setMedicalHistory(Map.of("asthma", "yes"));
            dto.setConsultedDoctor(true);
            dto.setQuestionnaire1(YesNo.YES);
            dto.setChestXray(ExamResult.NORMAL);
            dto.setHivAidsTest(ReactiveResult.NON_REACTIVE);
            dto.setBloodType(BloodType.A_POSITIVE);
            dto.setBasicPemeResult(PassStatus.PASSED);
            dto.setFlagMedicalLabResult(PassStatus.PASSED);
            dto.setAdditionalLabResult(PassStatus.PASSED);
            dto.setRecommendation(RecommendationValue.FIT_FOR_EMPLOYMENT);

            String json = objectMapper.writeValueAsString(dto);

            assertThat(json).contains("\"peme_id\"");
            assertThat(json).contains("\"created_date\"");
            assertThat(json).contains("\"updated_date\"");
            assertThat(json).contains("\"seafarer_profile_id\"");
            assertThat(json).contains("\"medical_history\"");
            assertThat(json).contains("\"consulted_doctor\"");
            assertThat(json).contains("\"questionnaire1\"");
            assertThat(json).contains("\"chest_xray\"");
            assertThat(json).contains("\"hiv_aids_test\"");
            assertThat(json).contains("\"blood_type\"");
            assertThat(json).contains("\"basic_peme_result\"");
            assertThat(json).contains("\"flag_medical_lab_result\"");
            assertThat(json).contains("\"additional_lab_result\"");
            assertThat(json).contains("\"recommendation\"");

            // Verify no camelCase leaks
            assertThat(json).doesNotContain("pemeId");
            assertThat(json).doesNotContain("seafarerProfileId");
            assertThat(json).doesNotContain("medicalHistory");
            assertThat(json).doesNotContain("consultedDoctor");
            assertThat(json).doesNotContain("hivAidsTest");
            assertThat(json).doesNotContain("bloodType");
            assertThat(json).doesNotContain("basicPemeResult");
            assertThat(json).doesNotContain("flagMedicalLabResult");
        }
    }

    @Nested
    @DisplayName("MlcRecordDto field names")
    class MlcRecordContract {

        @Test
        @DisplayName("serializes key fields to expected snake_case names")
        void shouldSerializeToExpectedSnakeCaseFields() throws Exception {
            MlcRecordDto dto = new MlcRecordDto();
            dto.setId(UUID.randomUUID());
            dto.setMlcId("MLC00000001");
            dto.setCreatedDate(LocalDateTime.now());
            dto.setUpdatedDate(LocalDateTime.now());
            dto.setSeafarerProfileId(UUID.randomUUID());
            dto.setVisualAids(List.of(VisualAid.SPECTACLES, VisualAid.CONTACT_LENSES));
            dto.setCertificateType(CertificateType.ILO_MLC);
            dto.setFitnessDetermination(FitnessDetermination.FIT_FOR_SEA_DUTY);
            dto.setIdDocumentsChecked(YesNo.YES);
            dto.setColourVisionMeetsStandards(YesNo.YES);

            String json = objectMapper.writeValueAsString(dto);

            assertThat(json).contains("\"mlc_id\"");
            assertThat(json).contains("\"created_date\"");
            assertThat(json).contains("\"updated_date\"");
            assertThat(json).contains("\"seafarer_profile_id\"");
            assertThat(json).contains("\"visual_aids\"");
            assertThat(json).contains("\"certificate_type\"");
            assertThat(json).contains("\"fitness_determination\"");
            assertThat(json).contains("\"id_documents_checked\"");
            assertThat(json).contains("\"colour_vision_meets_standards\"");

            // Verify no camelCase leaks
            assertThat(json).doesNotContain("mlcId");
            assertThat(json).doesNotContain("seafarerProfileId");
            assertThat(json).doesNotContain("visualAids");
            assertThat(json).doesNotContain("certificateType");
            assertThat(json).doesNotContain("fitnessDetermination");
            assertThat(json).doesNotContain("idDocumentsChecked");
            assertThat(json).doesNotContain("colourVisionMeetsStandards");
        }
    }

    @Nested
    @DisplayName("PanamaCertificateDto field names")
    class PanamaCertificateContract {

        @Test
        @DisplayName("serializes key fields to expected snake_case names")
        void shouldSerializeToExpectedSnakeCaseFields() throws Exception {
            PanamaCertificateDto dto = new PanamaCertificateDto();
            dto.setId(UUID.randomUUID());
            dto.setPanamaId("PAN00000001");
            dto.setCreatedDate(LocalDateTime.now());
            dto.setUpdatedDate(LocalDateTime.now());
            dto.setSeafarerProfileId(UUID.randomUUID());
            dto.setConditions(Map.of("condition1", "yes"));
            dto.setPhysicalExploration(Map.of("skin", "normal"));
            dto.setLabTests(Map.of("cbc", new LabTestResult("yes", "no", "clear")));
            dto.setLabOtherTests(Map.of("hiv", new OtherLabTestResult(true, "yes", "no", "clean")));
            dto.setTypeOfShip(ShipType.CONTAINER);
            dto.setTradeArea(TradeArea.WORLDWIDE);
            dto.setFitnessVisualAid(YesNo.NO);

            String json = objectMapper.writeValueAsString(dto);

            assertThat(json).contains("\"panama_id\"");
            assertThat(json).contains("\"created_date\"");
            assertThat(json).contains("\"updated_date\"");
            assertThat(json).contains("\"seafarer_profile_id\"");
            assertThat(json).contains("\"conditions\"");
            assertThat(json).contains("\"physical_exploration\"");
            assertThat(json).contains("\"lab_tests\"");
            assertThat(json).contains("\"lab_other_tests\"");
            assertThat(json).contains("\"type_of_ship\"");
            assertThat(json).contains("\"trade_area\"");
            assertThat(json).contains("\"fitness_visual_aid\"");

            // Verify no camelCase leaks
            assertThat(json).doesNotContain("panamaId");
            assertThat(json).doesNotContain("seafarerProfileId");
            assertThat(json).doesNotContain("physicalExploration");
            assertThat(json).doesNotContain("labTests");
            assertThat(json).doesNotContain("labOtherTests");
            assertThat(json).doesNotContain("typeOfShip");
            assertThat(json).doesNotContain("tradeArea");
            assertThat(json).doesNotContain("fitnessVisualAid");
        }
    }

    @Nested
    @DisplayName("Enum literal verification (Requirement 3.1)")
    class EnumLiterals {

        @Test
        @DisplayName("Gender serializes to exact frontend literals")
        void genderLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(Gender.MALE)).isEqualTo("\"Male\"");
            assertThat(objectMapper.writeValueAsString(Gender.FEMALE)).isEqualTo("\"Female\"");
        }

        @Test
        @DisplayName("RecommendationValue serializes to exact frontend literals")
        void recommendationLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(RecommendationValue.FIT_FOR_EMPLOYMENT))
                    .isEqualTo("\"Fit for Employment\"");
            assertThat(objectMapper.writeValueAsString(RecommendationValue.UNFIT_FOR_EMPLOYMENT))
                    .isEqualTo("\"Unfit for Employment\"");
        }

        @Test
        @DisplayName("BloodType serializes to exact frontend literals")
        void bloodTypeLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(BloodType.A_POSITIVE)).isEqualTo("\"A+\"");
            assertThat(objectMapper.writeValueAsString(BloodType.AB_NEGATIVE)).isEqualTo("\"AB-\"");
            assertThat(objectMapper.writeValueAsString(BloodType.O_POSITIVE)).isEqualTo("\"O+\"");
            assertThat(objectMapper.writeValueAsString(BloodType.B_NEGATIVE)).isEqualTo("\"B-\"");
        }

        @Test
        @DisplayName("FitnessDetermination serializes to exact frontend literals")
        void fitnessDeterminationLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.FIT_FOR_SEA_DUTY))
                    .isEqualTo("\"Fit for Sea Duty\"");
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.UNFIT_FOR_SEA_SERVICE))
                    .isEqualTo("\"Unfit for Sea Service\"");
        }

        @Test
        @DisplayName("CertificateType serializes to exact frontend literals")
        void certificateTypeLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(CertificateType.ILO_MLC))
                    .isEqualTo("\"ILO/MLC\"");
            assertThat(objectMapper.writeValueAsString(CertificateType.STCW))
                    .isEqualTo("\"STCW\"");
        }

        @Test
        @DisplayName("ReactiveResult serializes to exact frontend literals")
        void reactiveResultLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(ReactiveResult.NON_REACTIVE))
                    .isEqualTo("\"non_reactive\"");
            assertThat(objectMapper.writeValueAsString(ReactiveResult.REACTIVE))
                    .isEqualTo("\"reactive\"");
        }

        @Test
        @DisplayName("VisualAid serializes to exact frontend literals")
        void visualAidLiterals() throws Exception {
            assertThat(objectMapper.writeValueAsString(VisualAid.CONTACT_LENSES))
                    .isEqualTo("\"contact_lenses\"");
            assertThat(objectMapper.writeValueAsString(VisualAid.SPECTACLES))
                    .isEqualTo("\"spectacles\"");
        }
    }
}
