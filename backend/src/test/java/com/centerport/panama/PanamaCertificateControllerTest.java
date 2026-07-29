package com.centerport.panama;

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
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * WebMvcTest for PanamaCertificateController.
 * Validates HTTP status codes, validation behavior, snake_case JSON serialization,
 * and JSONB map round-trip for lab_tests, conditions, and physical_exploration.
 */
@WebMvcTest(PanamaCertificateController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class PanamaCertificateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PanamaCertificateService service;

    private static final UUID SAMPLE_PROFILE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");

    private PanamaCertificateDto sampleCertificate() {
        PanamaCertificateDto dto = new PanamaCertificateDto();
        dto.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        dto.setPanamaId("PAN00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 3, 10, 8, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 3, 10, 8, 0, 0));
        dto.setSeafarerProfileId(SAMPLE_PROFILE_ID);
        dto.setTypeOfShip(ShipType.CONTAINER);
        dto.setTradeArea(TradeArea.WORLDWIDE);
        dto.setQuestion37(YesNo.NO);
        dto.setFitnessVisualAid(YesNo.YES);
        dto.setFitnessDeckFit(true);
        dto.setFitnessDeckUnfit(false);

        // JSONB maps
        dto.setConditions(Map.of("headaches", "yes", "diabetes", "no"));
        dto.setPhysicalExploration(Map.of("skin", "N", "eyes", "A"));
        dto.setLabTests(Map.of(
                "cbc", new LabTestResult("normal", "", "all good"),
                "urinalysis", new LabTestResult("", "abnormal", "trace protein")
        ));
        dto.setLabOtherTests(Map.of(
                "hiv", new OtherLabTestResult(true, "normal", "", "non-reactive")
        ));

        return dto;
    }

    @Test
    void postValidCertificate_returns201() throws Exception {
        PanamaCertificateDto created = sampleCertificate();
        when(service.create(any(PanamaCertificateDto.class))).thenReturn(created);

        String body = objectMapper.writeValueAsString(sampleCertificate());

        mockMvc.perform(post("/api/panama-certificates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.data.panama_id").value("PAN00000001"))
                .andExpect(jsonPath("$.data.seafarer_profile_id").value(SAMPLE_PROFILE_ID.toString()));
    }

    @Test
    void postMissingSeafarerProfileId_returns400() throws Exception {
        PanamaCertificateDto dto = sampleCertificate();
        dto.setSeafarerProfileId(null);

        mockMvc.perform(post("/api/panama-certificates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").isNotEmpty());
    }

    @Test
    void postNullSeafarerProfileId_returns400() throws Exception {
        PanamaCertificateDto dto = sampleCertificate();
        dto.setSeafarerProfileId(null);

        mockMvc.perform(post("/api/panama-certificates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingCertificate_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(id.toString()))
                .andExpect(jsonPath("$.data.seafarer_profile_id").value(SAMPLE_PROFILE_ID.toString()));
    }

    @Test
    void getMissingCertificate_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("PanamaCertificate", id));

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Resource Not Found"))
                .andExpect(jsonPath("$.detail", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        PagedResponse<PanamaCertificateDto> pagedResponse = PagedResponse.<PanamaCertificateDto>builder()
                .content(List.of(sampleCertificate(), sampleCertificate()))
                .page(0)
                .size(20)
                .totalElements(2)
                .totalPages(1)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        when(service.findAll(any(String.class), any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/panama-certificates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content", hasSize(2)));
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.data.panama_id").exists())
                .andExpect(jsonPath("$.data.created_date").exists())
                .andExpect(jsonPath("$.data.updated_date").exists())
                .andExpect(jsonPath("$.data.seafarer_profile_id").exists())
                .andExpect(jsonPath("$.data.type_of_ship").exists())
                .andExpect(jsonPath("$.data.trade_area").exists())
                .andExpect(jsonPath("$.data.fitness_visual_aid").exists())
                .andExpect(jsonPath("$.data.fitness_deck_fit").exists())
                .andExpect(jsonPath("$.data.blood_pressure_systolic").doesNotExist()) // not set
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.data.panamaId").doesNotExist())
                .andExpect(jsonPath("$.data.createdDate").doesNotExist())
                .andExpect(jsonPath("$.data.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.data.seafarerProfileId").doesNotExist())
                .andExpect(jsonPath("$.data.typeOfShip").doesNotExist())
                .andExpect(jsonPath("$.data.tradeArea").doesNotExist());
    }

    @Test
    void responseRoundTripsConditionsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.conditions.headaches").value("yes"))
                .andExpect(jsonPath("$.data.conditions.diabetes").value("no"));
    }

    @Test
    void responseRoundTripsPhysicalExplorationMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.physical_exploration.skin").value("N"))
                .andExpect(jsonPath("$.data.physical_exploration.eyes").value("A"));
    }

    @Test
    void responseRoundTripsLabTestsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.lab_tests.cbc.normal").value("normal"))
                .andExpect(jsonPath("$.data.lab_tests.cbc.observations").value("all good"))
                .andExpect(jsonPath("$.data.lab_tests.urinalysis.abnormal").value("abnormal"))
                .andExpect(jsonPath("$.data.lab_tests.urinalysis.observations").value("trace protein"));
    }

    @Test
    void responseRoundTripsLabOtherTestsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.lab_other_tests.hiv.checked").value(true))
                .andExpect(jsonPath("$.data.lab_other_tests.hiv.normal").value("normal"))
                .andExpect(jsonPath("$.data.lab_other_tests.hiv.observations").value("non-reactive"));
    }

    @Test
    void putValidCertificate_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        PanamaCertificateDto updated = sampleCertificate();
        updated.setPhysicianName("Dr. Santos");
        when(service.update(any(UUID.class), any(PanamaCertificateDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/panama-certificates/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.physician_name").value("Dr. Santos"));
    }

    @Test
    void putMissingSeafarerProfileId_returns400() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        PanamaCertificateDto dto = sampleCertificate();
        dto.setSeafarerProfileId(null);

        mockMvc.perform(put("/api/panama-certificates/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").isNotEmpty());
    }
}
