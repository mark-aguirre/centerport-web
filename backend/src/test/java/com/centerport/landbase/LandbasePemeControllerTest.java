package com.centerport.landbase;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.GlobalExceptionHandler;
import com.centerport.common.enums.*;
import com.centerport.common.exception.NotFoundException;
import com.centerport.config.JacksonConfig;
import com.centerport.profile.SeafarerProfileDto;
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
import static org.mockito.ArgumentMatchers.isNull;
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

    private static final UUID PROFILE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID PEME_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    private SeafarerProfileDto sampleProfile() {
        SeafarerProfileDto profile = new SeafarerProfileDto();
        profile.setId(PROFILE_ID);
        profile.setProfileId("CMSI00000001");
        profile.setLastName("Santos");
        profile.setFirstName("Maria");
        profile.setMiddleName("Cruz");
        profile.setGender("FEMALE");
        profile.setNationality("Filipino");
        return profile;
    }

    private LandbasePemeDto samplePeme() {
        LandbasePemeDto dto = new LandbasePemeDto();
        dto.setId(PEME_ID);
        dto.setPemeId("PEME00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 3, 10, 9, 0, 0));
        dto.setSeafarerProfileId(PROFILE_ID);
        dto.setSeafarerProfile(sampleProfile());
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
                .andExpect(jsonPath("$.data.id").value(PEME_ID.toString()))
                .andExpect(jsonPath("$.data.peme_id").value("PEME00000001"))
                .andExpect(jsonPath("$.data.seafarer_profile_id").value(PROFILE_ID.toString()))
                .andExpect(jsonPath("$.data.seafarer_profile.last_name").value("Santos"));
    }

    @Test
    void postMissingProfileId_returns400() throws Exception {
        LandbasePemeDto dto = samplePeme();
        dto.setSeafarerProfileId(null);

        mockMvc.perform(post("/api/landbase-pemes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingPeme_returns200() throws Exception {
        when(service.findById(PEME_ID)).thenReturn(samplePeme());

        mockMvc.perform(get("/api/landbase-pemes/{id}", PEME_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(PEME_ID.toString()))
                .andExpect(jsonPath("$.data.seafarer_profile.last_name").value("Santos"));
    }

    @Test
    void getMissingPeme_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("LandbasePeme", id));

        mockMvc.perform(get("/api/landbase-pemes/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Resource Not Found"))
                .andExpect(jsonPath("$.detail", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        PagedResponse<LandbasePemeDto> pagedResponse = PagedResponse.<LandbasePemeDto>builder()
                .content(List.of(samplePeme(), samplePeme()))
                .page(0)
                .size(20)
                .totalElements(2)
                .totalPages(1)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        when(service.findAll(isNull(), any(Pageable.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/landbase-pemes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content", hasSize(2)));
    }

    @Test
    void putValidPeme_returns200() throws Exception {
        LandbasePemeDto updated = samplePeme();
        when(service.update(any(UUID.class), any(LandbasePemeDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/landbase-pemes/{id}", PEME_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.seafarer_profile.last_name").value("Santos"));
    }

    @Test
    void putMissingProfileId_returns400() throws Exception {
        LandbasePemeDto dto = samplePeme();
        dto.setSeafarerProfileId(null);

        mockMvc.perform(put("/api/landbase-pemes/{id}", PEME_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        when(service.findById(PEME_ID)).thenReturn(samplePeme());

        mockMvc.perform(get("/api/landbase-pemes/{id}", PEME_ID))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.data.peme_id").exists())
                .andExpect(jsonPath("$.data.created_date").exists())
                .andExpect(jsonPath("$.data.updated_date").exists())
                .andExpect(jsonPath("$.data.seafarer_profile_id").exists())
                .andExpect(jsonPath("$.data.seafarer_profile").exists())
                .andExpect(jsonPath("$.data.medical_history").exists())
                .andExpect(jsonPath("$.data.consulted_doctor").exists())
                .andExpect(jsonPath("$.data.chest_xray").exists())
                .andExpect(jsonPath("$.data.basic_peme_result").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.data.pemeId").doesNotExist())
                .andExpect(jsonPath("$.data.createdDate").doesNotExist())
                .andExpect(jsonPath("$.data.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.data.seafarerProfileId").doesNotExist())
                .andExpect(jsonPath("$.data.seafarerProfile").doesNotExist())
                .andExpect(jsonPath("$.data.medicalHistory").doesNotExist())
                .andExpect(jsonPath("$.data.consultedDoctor").doesNotExist())
                .andExpect(jsonPath("$.data.chestXray").doesNotExist())
                .andExpect(jsonPath("$.data.basicPemeResult").doesNotExist());
    }
}
