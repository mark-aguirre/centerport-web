package com.centerport.landbase;

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
 * WebMvcTest for LandbasePemeController.
 * Validates HTTP status codes, validation behavior, and snake_case JSON serialization.
 */
@WebMvcTest(LandbasePemeController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class LandbasePemeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LandbasePemeService service;

    private LandbasePemeDto samplePeme() {
        LandbasePemeDto dto = new LandbasePemeDto();
        dto.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        dto.setPemeId("PEME00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setLastName("Santos");
        dto.setFirstName("Maria");
        dto.setMiddleName("Cruz");
        dto.setPlaceOfBirth("Cebu");
        dto.setPassportNo("P1234567");
        dto.setReligion("Catholic");
        dto.setNationality("Filipino");
        dto.setGender(Gender.FEMALE);
        dto.setCivilStatus(CivilStatus.SINGLE);
        dto.setAddress("123 Main St");
        dto.setContactNo("09171234567");
        dto.setEmployer("ABC Corp");
        dto.setPosition("Nurse");
        dto.setMedicalHistory(Map.of("hypertension", "no", "diabetes", "no"));
        dto.setConsultedDoctor(false);
        dto.setQuestionnaire1(YesNo.NO);
        dto.setChestXray(ExamResult.NORMAL);
        dto.setBasicPemeResult(PassStatus.PASSED);
        dto.setRecommendation(RecommendationValue.FIT_FOR_EMPLOYMENT);
        return dto;
    }

    @Test
    void postValidPeme_returns201() throws Exception {
        LandbasePemeDto created = samplePeme();
        when(service.create(any(LandbasePemeDto.class))).thenReturn(created);

        String body = objectMapper.writeValueAsString(samplePeme());

        mockMvc.perform(post("/api/landbase-pemes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.peme_id").value("PEME00000001"))
                .andExpect(jsonPath("$.last_name").value("Santos"));
    }

    @Test
    void postBlankLastName_returns400() throws Exception {
        LandbasePemeDto dto = samplePeme();
        dto.setLastName("");

        mockMvc.perform(post("/api/landbase-pemes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void postMissingLastName_returns400() throws Exception {
        LandbasePemeDto dto = samplePeme();
        dto.setLastName(null);

        mockMvc.perform(post("/api/landbase-pemes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingPeme_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(samplePeme());

        mockMvc.perform(get("/api/landbase-pemes/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.last_name").value("Santos"));
    }

    @Test
    void getMissingPeme_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("LandbasePeme", id));

        mockMvc.perform(get("/api/landbase-pemes/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        when(service.findAll()).thenReturn(List.of(samplePeme(), samplePeme()));

        mockMvc.perform(get("/api/landbase-pemes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void putValidPeme_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        LandbasePemeDto updated = samplePeme();
        updated.setLastName("Garcia");
        when(service.update(any(UUID.class), any(LandbasePemeDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/landbase-pemes/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.last_name").value("Garcia"));
    }

    @Test
    void putBlankLastName_returns400() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        LandbasePemeDto dto = samplePeme();
        dto.setLastName("");

        mockMvc.perform(put("/api/landbase-pemes/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(samplePeme());

        mockMvc.perform(get("/api/landbase-pemes/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.peme_id").exists())
                .andExpect(jsonPath("$.created_date").exists())
                .andExpect(jsonPath("$.updated_date").exists())
                .andExpect(jsonPath("$.last_name").exists())
                .andExpect(jsonPath("$.first_name").exists())
                .andExpect(jsonPath("$.middle_name").exists())
                .andExpect(jsonPath("$.medical_history").exists())
                .andExpect(jsonPath("$.consulted_doctor").exists())
                .andExpect(jsonPath("$.chest_xray").exists())
                .andExpect(jsonPath("$.basic_peme_result").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.pemeId").doesNotExist())
                .andExpect(jsonPath("$.createdDate").doesNotExist())
                .andExpect(jsonPath("$.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.lastName").doesNotExist())
                .andExpect(jsonPath("$.firstName").doesNotExist())
                .andExpect(jsonPath("$.middleName").doesNotExist())
                .andExpect(jsonPath("$.medicalHistory").doesNotExist())
                .andExpect(jsonPath("$.consultedDoctor").doesNotExist())
                .andExpect(jsonPath("$.chestXray").doesNotExist())
                .andExpect(jsonPath("$.basicPemeResult").doesNotExist());
    }
}
