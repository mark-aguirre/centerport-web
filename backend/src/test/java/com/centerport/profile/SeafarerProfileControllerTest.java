package com.centerport.profile;

import com.centerport.common.GlobalExceptionHandler;
import com.centerport.common.NotFoundException;
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
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * WebMvcTest for SeafarerProfileController.
 * Validates HTTP status codes, validation behavior, and snake_case JSON serialization.
 */
@WebMvcTest(SeafarerProfileController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class SeafarerProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SeafarerProfileService service;

    private SeafarerProfileDto sampleProfile() {
        SeafarerProfileDto dto = new SeafarerProfileDto();
        dto.setId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        dto.setProfileId("CMSI00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 1, 15, 10, 30, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 1, 15, 10, 30, 0));
        dto.setLastName("Dela Cruz");
        dto.setFirstName("Juan");
        dto.setMiddleName("Santos");
        dto.setCity("Manila");
        return dto;
    }

    @Test
    void postValidProfile_returns201() throws Exception {
        SeafarerProfileDto created = sampleProfile();
        when(service.create(any(SeafarerProfileDto.class))).thenReturn(created);

        String body = objectMapper.writeValueAsString(sampleProfile());

        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("11111111-1111-1111-1111-111111111111"))
                .andExpect(jsonPath("$.profile_id").value("CMSI00000001"))
                .andExpect(jsonPath("$.last_name").value("Dela Cruz"));
    }

    @Test
    void postBlankLastName_returns400() throws Exception {
        SeafarerProfileDto dto = sampleProfile();
        dto.setLastName("");

        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void postMissingLastName_returns400() throws Exception {
        SeafarerProfileDto dto = sampleProfile();
        dto.setLastName(null);

        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingProfile_returns200() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        when(service.findById(id)).thenReturn(sampleProfile());

        mockMvc.perform(get("/api/profiles/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.last_name").value("Dela Cruz"));
    }

    @Test
    void getMissingProfile_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("SeafarerProfile", id));

        mockMvc.perform(get("/api/profiles/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        when(service.findAll()).thenReturn(List.of(sampleProfile(), sampleProfile()));

        mockMvc.perform(get("/api/profiles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void putValidProfile_returns200() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        SeafarerProfileDto updated = sampleProfile();
        updated.setLastName("Garcia");
        when(service.update(any(UUID.class), any(SeafarerProfileDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/profiles/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.last_name").value("Garcia"));
    }

    @Test
    void putBlankLastName_returns400() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        SeafarerProfileDto dto = sampleProfile();
        dto.setLastName("");

        mockMvc.perform(put("/api/profiles/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("11111111-1111-1111-1111-111111111111");
        when(service.findById(id)).thenReturn(sampleProfile());

        mockMvc.perform(get("/api/profiles/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.profile_id").exists())
                .andExpect(jsonPath("$.created_date").exists())
                .andExpect(jsonPath("$.updated_date").exists())
                .andExpect(jsonPath("$.last_name").exists())
                .andExpect(jsonPath("$.first_name").exists())
                .andExpect(jsonPath("$.middle_name").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.profileId").doesNotExist())
                .andExpect(jsonPath("$.createdDate").doesNotExist())
                .andExpect(jsonPath("$.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.lastName").doesNotExist())
                .andExpect(jsonPath("$.firstName").doesNotExist())
                .andExpect(jsonPath("$.middleName").doesNotExist());
    }
}
