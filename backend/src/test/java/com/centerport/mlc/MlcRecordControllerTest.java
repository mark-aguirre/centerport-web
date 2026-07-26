package com.centerport.mlc;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.GlobalExceptionHandler;
import com.centerport.common.enums.*;
import com.centerport.common.exception.NotFoundException;
import com.centerport.config.JacksonConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * WebMvcTest for MlcRecordController.
 * Validates HTTP status codes, validation behavior, snake_case JSON serialization,
 * and visual_aids list round-trip.
 */
@WebMvcTest(MlcRecordController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class MlcRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MlcRecordService service;

    private MlcRecordDto sampleRecord() {
        MlcRecordDto dto = new MlcRecordDto();
        dto.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        dto.setMlcId("MLC00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setLastName("Santos");
        dto.setFirstName("Maria");
        dto.setMiddleName("Cruz");
        dto.setPlaceOfBirth("Cebu");
        dto.setPassportNo("P123456");
        dto.setReligion("Catholic");
        dto.setNationality("Filipino");
        dto.setGender(Gender.FEMALE);
        dto.setCivilStatus(CivilStatus.SINGLE);
        dto.setAddress("123 Main St");
        dto.setContactNo("09171234567");
        dto.setEmployer("Pacific Shipping");
        dto.setPosition("Chief Officer");
        dto.setDateOfBirth("1990-05-15");
        dto.setAge("34");
        dto.setSirbNo("SIRB001");
        dto.setRank("Officer");
        dto.setVesselName("MV Pacific");
        dto.setVesselType("Cargo");
        dto.setShippingCompany("Pacific Lines");
        dto.setManningAgency("Manning Corp");
        dto.setCertificateType(CertificateType.ILO_MLC);
        dto.setFitnessDetermination(FitnessDetermination.FIT_FOR_SEA_DUTY);
        dto.setDateOfExamination("2024-03-01");
        dto.setDateIssued("2024-03-05");
        dto.setValidUntil("2026-03-05");
        dto.setIssuingAuthority("MARINA");
        dto.setExaminingPhysician("Dr. Reyes");
        dto.setMedicalDirector("Dr. Cruz");
        dto.setLimitationsRemarks("None");
        dto.setIdDocumentsChecked(YesNo.YES);
        dto.setHearingMeetsStandards(YesNo.YES);
        dto.setUnaidedHearingSatisfactory(YesNo.YES);
        dto.setVisualAcuityMeetsStandards(YesNo.YES);
        dto.setColourVisionMeetsStandards(YesNo.YES);
        dto.setVisualAids(List.of(VisualAid.SPECTACLES, VisualAid.CONTACT_LENSES));
        dto.setDateColourVisionTest("2024-02-28");
        dto.setFitForLookout(YesNo.YES);
        dto.setNoLimitations(YesNo.YES);
        dto.setLimitationsDetails("");
        dto.setApplicantConditionRisk(YesNo.NO);
        dto.setDateInitialPeme("2024-03-01");
        dto.setDateOfFitness("2024-03-05");
        dto.setValidUntilDate("2026-03-05");
        dto.setMedicalCertificationNo("CERT-001");
        return dto;
    }

    @Test
    void postValidRecord_returns201() throws Exception {
        MlcRecordDto created = sampleRecord();
        when(service.create(any(MlcRecordDto.class))).thenReturn(created);

        String body = objectMapper.writeValueAsString(sampleRecord());

        mockMvc.perform(post("/api/mlc-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.data.mlc_id").value("MLC00000001"))
                .andExpect(jsonPath("$.data.last_name").value("Santos"));
    }

    @Test
    void postBlankLastName_returns400() throws Exception {
        MlcRecordDto dto = sampleRecord();
        dto.setLastName("");

        mockMvc.perform(post("/api/mlc-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").isNotEmpty());
    }

    @Test
    void postMissingLastName_returns400() throws Exception {
        MlcRecordDto dto = sampleRecord();
        dto.setLastName(null);

        mockMvc.perform(post("/api/mlc-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingRecord_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleRecord());

        mockMvc.perform(get("/api/mlc-records/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(id.toString()))
                .andExpect(jsonPath("$.data.last_name").value("Santos"));
    }

    @Test
    void getMissingRecord_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("MlcRecord", id));

        mockMvc.perform(get("/api/mlc-records/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Resource Not Found"))
                .andExpect(jsonPath("$.detail", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        PagedResponse<MlcRecordDto> pagedResponse = PagedResponse.<MlcRecordDto>builder()
                .content(List.of(sampleRecord(), sampleRecord()))
                .page(0)
                .size(20)
                .totalElements(2)
                .totalPages(1)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        when(service.findAll(any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/mlc-records"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content", hasSize(2)));
    }

    @Test
    void putValidRecord_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        MlcRecordDto updated = sampleRecord();
        updated.setLastName("Garcia");
        when(service.update(any(UUID.class), any(MlcRecordDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/mlc-records/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.last_name").value("Garcia"));
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleRecord());

        mockMvc.perform(get("/api/mlc-records/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.data.mlc_id").exists())
                .andExpect(jsonPath("$.data.created_date").exists())
                .andExpect(jsonPath("$.data.updated_date").exists())
                .andExpect(jsonPath("$.data.last_name").exists())
                .andExpect(jsonPath("$.data.first_name").exists())
                .andExpect(jsonPath("$.data.date_of_birth").exists())
                .andExpect(jsonPath("$.data.vessel_name").exists())
                .andExpect(jsonPath("$.data.certificate_type").exists())
                .andExpect(jsonPath("$.data.fitness_determination").exists())
                .andExpect(jsonPath("$.data.visual_aids").exists())
                .andExpect(jsonPath("$.data.id_documents_checked").exists())
                .andExpect(jsonPath("$.data.valid_until_date").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.data.mlcId").doesNotExist())
                .andExpect(jsonPath("$.data.createdDate").doesNotExist())
                .andExpect(jsonPath("$.data.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.data.lastName").doesNotExist())
                .andExpect(jsonPath("$.data.firstName").doesNotExist())
                .andExpect(jsonPath("$.data.dateOfBirth").doesNotExist())
                .andExpect(jsonPath("$.data.vesselName").doesNotExist())
                .andExpect(jsonPath("$.data.certificateType").doesNotExist())
                .andExpect(jsonPath("$.data.fitnessDetermination").doesNotExist())
                .andExpect(jsonPath("$.data.visualAids").doesNotExist())
                .andExpect(jsonPath("$.data.idDocumentsChecked").doesNotExist())
                .andExpect(jsonPath("$.data.validUntilDate").doesNotExist());
    }

    @Test
    void visualAidsListRoundTrip() throws Exception {
        MlcRecordDto dto = sampleRecord();
        dto.setVisualAids(List.of(VisualAid.SPECTACLES, VisualAid.CONTACT_LENSES));
        when(service.create(any(MlcRecordDto.class))).thenReturn(dto);

        String body = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/mlc-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.visual_aids").isArray())
                .andExpect(jsonPath("$.data.visual_aids", hasSize(2)))
                .andExpect(jsonPath("$.data.visual_aids[0]").value("spectacles"))
                .andExpect(jsonPath("$.data.visual_aids[1]").value("contact_lenses"));
    }
}
