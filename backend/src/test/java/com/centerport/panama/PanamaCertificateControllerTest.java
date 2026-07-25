package com.centerport.panama;

import com.centerport.common.GlobalExceptionHandler;
import com.centerport.common.NotFoundException;
import com.centerport.common.enums.*;
import com.centerport.config.JacksonConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
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

    private PanamaCertificateDto sampleCertificate() {
        PanamaCertificateDto dto = new PanamaCertificateDto();
        dto.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        dto.setPanamaId("PAN00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 3, 10, 8, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 3, 10, 8, 0, 0));
        dto.setFullName("Juan Dela Cruz");
        dto.setSex(Gender.MALE);
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
                .andExpect(jsonPath("$.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.panama_id").value("PAN00000001"))
                .andExpect(jsonPath("$.full_name").value("Juan Dela Cruz"));
    }

    @Test
    void postBlankFullName_returns400() throws Exception {
        PanamaCertificateDto dto = sampleCertificate();
        dto.setFullName("");

        mockMvc.perform(post("/api/panama-certificates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void postMissingFullName_returns400() throws Exception {
        PanamaCertificateDto dto = sampleCertificate();
        dto.setFullName(null);

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
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.full_name").value("Juan Dela Cruz"));
    }

    @Test
    void getMissingCertificate_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("PanamaCertificate", id));

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        when(service.findAll()).thenReturn(List.of(sampleCertificate(), sampleCertificate()));

        mockMvc.perform(get("/api/panama-certificates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.panama_id").exists())
                .andExpect(jsonPath("$.created_date").exists())
                .andExpect(jsonPath("$.updated_date").exists())
                .andExpect(jsonPath("$.full_name").exists())
                .andExpect(jsonPath("$.type_of_ship").exists())
                .andExpect(jsonPath("$.trade_area").exists())
                .andExpect(jsonPath("$.fitness_visual_aid").exists())
                .andExpect(jsonPath("$.fitness_deck_fit").exists())
                .andExpect(jsonPath("$.blood_pressure_systolic").doesNotExist()) // not set
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.panamaId").doesNotExist())
                .andExpect(jsonPath("$.createdDate").doesNotExist())
                .andExpect(jsonPath("$.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.fullName").doesNotExist())
                .andExpect(jsonPath("$.typeOfShip").doesNotExist())
                .andExpect(jsonPath("$.tradeArea").doesNotExist());
    }

    @Test
    void responseRoundTripsConditionsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conditions.headaches").value("yes"))
                .andExpect(jsonPath("$.conditions.diabetes").value("no"));
    }

    @Test
    void responseRoundTripsPhysicalExplorationMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.physical_exploration.skin").value("N"))
                .andExpect(jsonPath("$.physical_exploration.eyes").value("A"));
    }

    @Test
    void responseRoundTripsLabTestsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lab_tests.cbc.normal").value("normal"))
                .andExpect(jsonPath("$.lab_tests.cbc.observations").value("all good"))
                .andExpect(jsonPath("$.lab_tests.urinalysis.abnormal").value("abnormal"))
                .andExpect(jsonPath("$.lab_tests.urinalysis.observations").value("trace protein"));
    }

    @Test
    void responseRoundTripsLabOtherTestsMap() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleCertificate());

        mockMvc.perform(get("/api/panama-certificates/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lab_other_tests.hiv.checked").value(true))
                .andExpect(jsonPath("$.lab_other_tests.hiv.normal").value("normal"))
                .andExpect(jsonPath("$.lab_other_tests.hiv.observations").value("non-reactive"));
    }

    @Test
    void putValidCertificate_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        PanamaCertificateDto updated = sampleCertificate();
        updated.setFullName("Maria Santos");
        when(service.update(any(UUID.class), any(PanamaCertificateDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/panama-certificates/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.full_name").value("Maria Santos"));
    }

    @Test
    void putBlankFullName_returns400() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        PanamaCertificateDto dto = sampleCertificate();
        dto.setFullName("");

        mockMvc.perform(put("/api/panama-certificates/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}
