package com.centerport.common.enums;

import com.centerport.config.JacksonConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EnumSerializationTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new JacksonConfig().objectMapper();
    }

    // --- Gender ---
    @Nested
    class GenderTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(Gender.MALE)).isEqualTo("\"Male\"");
            assertThat(objectMapper.writeValueAsString(Gender.FEMALE)).isEqualTo("\"Female\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Male\"", Gender.class)).isEqualTo(Gender.MALE);
            assertThat(objectMapper.readValue("\"Female\"", Gender.class)).isEqualTo(Gender.FEMALE);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", Gender.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Unknown\"", Gender.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- CivilStatus ---
    @Nested
    class CivilStatusTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(CivilStatus.SINGLE)).isEqualTo("\"Single\"");
            assertThat(objectMapper.writeValueAsString(CivilStatus.MARRIED)).isEqualTo("\"Married\"");
            assertThat(objectMapper.writeValueAsString(CivilStatus.WIDOWED)).isEqualTo("\"Widowed\"");
            assertThat(objectMapper.writeValueAsString(CivilStatus.SEPARATED)).isEqualTo("\"Separated\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Single\"", CivilStatus.class)).isEqualTo(CivilStatus.SINGLE);
            assertThat(objectMapper.readValue("\"Married\"", CivilStatus.class)).isEqualTo(CivilStatus.MARRIED);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", CivilStatus.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Divorced\"", CivilStatus.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- BPClassification ---
    @Nested
    class BPClassificationTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(BPClassification.NORMAL)).isEqualTo("\"Normal\"");
            assertThat(objectMapper.writeValueAsString(BPClassification.HYPERTENSION_STAGE_1)).isEqualTo("\"Hypertension Stage 1\"");
            assertThat(objectMapper.writeValueAsString(BPClassification.HYPERTENSION_STAGE_2)).isEqualTo("\"Hypertension Stage 2\"");
            assertThat(objectMapper.writeValueAsString(BPClassification.HYPERTENSIVE_CRISIS)).isEqualTo("\"Hypertensive Crisis\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Hypertension Stage 1\"", BPClassification.class))
                    .isEqualTo(BPClassification.HYPERTENSION_STAGE_1);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", BPClassification.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"High\"", BPClassification.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- VisualAcuityResult ---
    @Nested
    class VisualAcuityResultTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(VisualAcuityResult.NORMAL)).isEqualTo("\"Normal\"");
            assertThat(objectMapper.writeValueAsString(VisualAcuityResult.WITH_CORRECTION)).isEqualTo("\"With Correction\"");
            assertThat(objectMapper.writeValueAsString(VisualAcuityResult.IMPAIRED)).isEqualTo("\"Impaired\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"With Correction\"", VisualAcuityResult.class))
                    .isEqualTo(VisualAcuityResult.WITH_CORRECTION);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", VisualAcuityResult.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Blind\"", VisualAcuityResult.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- ExamFinding ---
    @Nested
    class ExamFindingTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(ExamFinding.NORMAL)).isEqualTo("\"normal\"");
            assertThat(objectMapper.writeValueAsString(ExamFinding.ABNORMAL)).isEqualTo("\"abnormal\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"normal\"", ExamFinding.class)).isEqualTo(ExamFinding.NORMAL);
            assertThat(objectMapper.readValue("\"abnormal\"", ExamFinding.class)).isEqualTo(ExamFinding.ABNORMAL);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", ExamFinding.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"NORMAL\"", ExamFinding.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }



    // --- YesNo ---
    @Nested
    class YesNoTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(YesNo.YES)).isEqualTo("\"yes\"");
            assertThat(objectMapper.writeValueAsString(YesNo.NO)).isEqualTo("\"no\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"yes\"", YesNo.class)).isEqualTo(YesNo.YES);
            assertThat(objectMapper.readValue("\"no\"", YesNo.class)).isEqualTo(YesNo.NO);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", YesNo.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Yes\"", YesNo.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- ExamResult ---
    @Nested
    class ExamResultTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(ExamResult.NORMAL)).isEqualTo("\"normal\"");
            assertThat(objectMapper.writeValueAsString(ExamResult.WITH_FINDINGS)).isEqualTo("\"with_findings\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"with_findings\"", ExamResult.class)).isEqualTo(ExamResult.WITH_FINDINGS);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", ExamResult.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"abnormal\"", ExamResult.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- ReactiveResult ---
    @Nested
    class ReactiveResultTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(ReactiveResult.REACTIVE)).isEqualTo("\"reactive\"");
            assertThat(objectMapper.writeValueAsString(ReactiveResult.NON_REACTIVE)).isEqualTo("\"non_reactive\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"non_reactive\"", ReactiveResult.class)).isEqualTo(ReactiveResult.NON_REACTIVE);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", ReactiveResult.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"positive\"", ReactiveResult.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- PassStatus ---
    @Nested
    class PassStatusTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(PassStatus.PASSED)).isEqualTo("\"passed\"");
            assertThat(objectMapper.writeValueAsString(PassStatus.WITH_SIGNIFICANT_FINDINGS)).isEqualTo("\"with_significant_findings\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"with_significant_findings\"", PassStatus.class))
                    .isEqualTo(PassStatus.WITH_SIGNIFICANT_FINDINGS);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", PassStatus.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"failed\"", PassStatus.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- PregnancyTestResult ---
    @Nested
    class PregnancyTestResultTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(PregnancyTestResult.NOT_APPLICABLE)).isEqualTo("\"N/A\"");
            assertThat(objectMapper.writeValueAsString(PregnancyTestResult.POSITIVE)).isEqualTo("\"Positive\"");
            assertThat(objectMapper.writeValueAsString(PregnancyTestResult.NEGATIVE)).isEqualTo("\"Negative\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"N/A\"", PregnancyTestResult.class)).isEqualTo(PregnancyTestResult.NOT_APPLICABLE);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", PregnancyTestResult.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Maybe\"", PregnancyTestResult.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- PsychologicalTestResult ---
    @Nested
    class PsychologicalTestResultTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(PsychologicalTestResult.RECOMMENDED)).isEqualTo("\"Recommended\"");
            assertThat(objectMapper.writeValueAsString(PsychologicalTestResult.RECOMMENDED_WITH_RESERVATION)).isEqualTo("\"Rec. w/Reservation\"");
            assertThat(objectMapper.writeValueAsString(PsychologicalTestResult.NOT_RECOMMENDED)).isEqualTo("\"Not Recommended\"");
            assertThat(objectMapper.writeValueAsString(PsychologicalTestResult.NOT_DONE)).isEqualTo("\"Not Done\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Rec. w/Reservation\"", PsychologicalTestResult.class))
                    .isEqualTo(PsychologicalTestResult.RECOMMENDED_WITH_RESERVATION);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", PsychologicalTestResult.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Pending\"", PsychologicalTestResult.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- BloodType ---
    @Nested
    class BloodTypeTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(BloodType.A_POSITIVE)).isEqualTo("\"A+\"");
            assertThat(objectMapper.writeValueAsString(BloodType.A_NEGATIVE)).isEqualTo("\"A-\"");
            assertThat(objectMapper.writeValueAsString(BloodType.AB_POSITIVE)).isEqualTo("\"AB+\"");
            assertThat(objectMapper.writeValueAsString(BloodType.O_NEGATIVE)).isEqualTo("\"O-\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"A+\"", BloodType.class)).isEqualTo(BloodType.A_POSITIVE);
            assertThat(objectMapper.readValue("\"AB-\"", BloodType.class)).isEqualTo(BloodType.AB_NEGATIVE);
            assertThat(objectMapper.readValue("\"O+\"", BloodType.class)).isEqualTo(BloodType.O_POSITIVE);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", BloodType.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"C+\"", BloodType.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- RecommendationValue ---
    @Nested
    class RecommendationValueTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(RecommendationValue.FIT_FOR_EMPLOYMENT)).isEqualTo("\"Fit for Employment\"");
            assertThat(objectMapper.writeValueAsString(RecommendationValue.UNFIT_FOR_EMPLOYMENT)).isEqualTo("\"Unfit for Employment\"");
            assertThat(objectMapper.writeValueAsString(RecommendationValue.REQUIRES_FURTHER_EVALUATION)).isEqualTo("\"Requires Further Evaluation\"");
            assertThat(objectMapper.writeValueAsString(RecommendationValue.TEMPORARILY_UNFIT)).isEqualTo("\"Temporarily Unfit\"");
            assertThat(objectMapper.writeValueAsString(RecommendationValue.FIT_WITH_RESTRICTION)).isEqualTo("\"Fit with Restriction\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Fit for Employment\"", RecommendationValue.class))
                    .isEqualTo(RecommendationValue.FIT_FOR_EMPLOYMENT);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", RecommendationValue.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Maybe Fit\"", RecommendationValue.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- VisualAid (no empty-string → null; empty string is invalid) ---
    @Nested
    class VisualAidTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(VisualAid.SPECTACLES)).isEqualTo("\"spectacles\"");
            assertThat(objectMapper.writeValueAsString(VisualAid.CONTACT_LENSES)).isEqualTo("\"contact_lenses\"");
            assertThat(objectMapper.writeValueAsString(VisualAid.NONE)).isEqualTo("\"none\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"spectacles\"", VisualAid.class)).isEqualTo(VisualAid.SPECTACLES);
            assertThat(objectMapper.readValue("\"contact_lenses\"", VisualAid.class)).isEqualTo(VisualAid.CONTACT_LENSES);
            assertThat(objectMapper.readValue("\"none\"", VisualAid.class)).isEqualTo(VisualAid.NONE);
        }

        @Test
        void shouldThrowOnEmptyString() {
            assertThatThrownBy(() -> objectMapper.readValue("\"\"", VisualAid.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"glasses\"", VisualAid.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- FitnessDetermination ---
    @Nested
    class FitnessDeterminationTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.FIT_FOR_SEA_DUTY)).isEqualTo("\"Fit for Sea Duty\"");
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.FIT_WITH_RESTRICTIONS)).isEqualTo("\"Fit with Restrictions\"");
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.TEMPORARILY_UNFIT)).isEqualTo("\"Temporarily Unfit\"");
            assertThat(objectMapper.writeValueAsString(FitnessDetermination.UNFIT_FOR_SEA_SERVICE)).isEqualTo("\"Unfit for Sea Service\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Fit for Sea Duty\"", FitnessDetermination.class))
                    .isEqualTo(FitnessDetermination.FIT_FOR_SEA_DUTY);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", FitnessDetermination.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Fit\"", FitnessDetermination.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- CertificateType ---
    @Nested
    class CertificateTypeTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(CertificateType.ILO_MLC)).isEqualTo("\"ILO/MLC\"");
            assertThat(objectMapper.writeValueAsString(CertificateType.STCW)).isEqualTo("\"STCW\"");
            assertThat(objectMapper.writeValueAsString(CertificateType.FLAG_STATE)).isEqualTo("\"Flag State\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"ILO/MLC\"", CertificateType.class)).isEqualTo(CertificateType.ILO_MLC);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", CertificateType.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"SOLAS\"", CertificateType.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- ShipType ---
    @Nested
    class ShipTypeTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(ShipType.CONTAINER)).isEqualTo("\"Container\"");
            assertThat(objectMapper.writeValueAsString(ShipType.TANKER)).isEqualTo("\"Tanker\"");
            assertThat(objectMapper.writeValueAsString(ShipType.PASSENGER)).isEqualTo("\"Passenger\"");
            assertThat(objectMapper.writeValueAsString(ShipType.OTHERS)).isEqualTo("\"Others\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Others\"", ShipType.class)).isEqualTo(ShipType.OTHERS);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", ShipType.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Cargo\"", ShipType.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- TradeArea ---
    @Nested
    class TradeAreaTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(TradeArea.COASTAL)).isEqualTo("\"Coastal\"");
            assertThat(objectMapper.writeValueAsString(TradeArea.TROPICAL)).isEqualTo("\"Tropical\"");
            assertThat(objectMapper.writeValueAsString(TradeArea.WORLDWIDE)).isEqualTo("\"Worldwide\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"Worldwide\"", TradeArea.class)).isEqualTo(TradeArea.WORLDWIDE);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", TradeArea.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"Arctic\"", TradeArea.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }

    // --- PhysicalExplorationValue ---
    @Nested
    class PhysicalExplorationValueTest {
        @Test
        void shouldSerializeToFrontendLiteral() throws Exception {
            assertThat(objectMapper.writeValueAsString(PhysicalExplorationValue.NORMAL)).isEqualTo("\"N\"");
            assertThat(objectMapper.writeValueAsString(PhysicalExplorationValue.ABNORMAL)).isEqualTo("\"A\"");
        }

        @Test
        void shouldDeserializeFromFrontendLiteral() throws Exception {
            assertThat(objectMapper.readValue("\"N\"", PhysicalExplorationValue.class)).isEqualTo(PhysicalExplorationValue.NORMAL);
            assertThat(objectMapper.readValue("\"A\"", PhysicalExplorationValue.class)).isEqualTo(PhysicalExplorationValue.ABNORMAL);
        }

        @Test
        void shouldDeserializeEmptyStringToNull() throws Exception {
            assertThat(objectMapper.readValue("\"\"", PhysicalExplorationValue.class)).isNull();
        }

        @Test
        void shouldThrowOnInvalidValue() {
            assertThatThrownBy(() -> objectMapper.readValue("\"X\"", PhysicalExplorationValue.class))
                    .hasCauseInstanceOf(IllegalArgumentException.class);
        }
    }
}
