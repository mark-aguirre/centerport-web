package com.centerport.medical;

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
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * WebMvcTest for MedicalExamController.
 * Validates HTTP status codes, validation behavior, snake_case JSON serialization,
 * and JSONB map round-trip.
 */
@WebMvcTest(MedicalExamController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class MedicalExamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MedicalExamService service;

    private MedicalExamDto sampleExam() {
        MedicalExamDto dto = new MedicalExamDto();
        dto.setId(UUID.fromString("22222222-2222-2222-2222-222222222222"));
        dto.setExamId("MED00000001");
        dto.setCreatedDate(LocalDateTime.of(2024, 2, 10, 9, 0, 0));
        dto.setUpdatedDate(LocalDateTime.of(2024, 2, 10, 9, 0, 0));
        dto.setLastName("Santos");
        dto.setFirstName("Maria");
        dto.setMiddleName("Cruz");
        dto.setFindingsA(Map.of("headache", true, "dizziness", false));
        dto.setFindingsB(Map.of("back_pain", true));
        dto.setFindingsC(Map.of("chest_pain", false));
        dto.setQuestionnaire(Map.of("q1", "yes", "q2", "no"));
        dto.setMedicalHistory(Map.of("diabetes", "none", "hypertension", "controlled"));
        return dto;
    }

    @Test
    void postValidExam_returns201() throws Exception {
        MedicalExamDto created = sampleExam();
        when(service.create(any(MedicalExamDto.class))).thenReturn(created);

        String body = objectMapper.writeValueAsString(sampleExam());

        mockMvc.perform(post("/api/medical-exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.exam_id").value("MED00000001"))
                .andExpect(jsonPath("$.last_name").value("Santos"))
                .andExpect(jsonPath("$.findings_a.headache").value(true))
                .andExpect(jsonPath("$.findings_a.dizziness").value(false))
                .andExpect(jsonPath("$.questionnaire.q1").value("yes"))
                .andExpect(jsonPath("$.medical_history.diabetes").value("none"));
    }

    @Test
    void postBlankLastName_returns400() throws Exception {
        MedicalExamDto dto = sampleExam();
        dto.setLastName("");

        mockMvc.perform(post("/api/medical-exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void postMissingLastName_returns400() throws Exception {
        MedicalExamDto dto = sampleExam();
        dto.setLastName(null);

        mockMvc.perform(post("/api/medical-exams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getExistingExam_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleExam());

        mockMvc.perform(get("/api/medical-exams/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.last_name").value("Santos"))
                .andExpect(jsonPath("$.exam_id").value("MED00000001"));
    }

    @Test
    void getMissingExam_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("MedicalExam", id));

        mockMvc.perform(get("/api/medical-exams/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        when(service.findAll(null)).thenReturn(List.of(sampleExam(), sampleExam()));

        mockMvc.perform(get("/api/medical-exams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void putValidExam_returns200() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        MedicalExamDto updated = sampleExam();
        updated.setLastName("Garcia");
        when(service.update(any(UUID.class), any(MedicalExamDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/medical-exams/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.last_name").value("Garcia"));
    }

    @Test
    void putBlankLastName_returns400() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        MedicalExamDto dto = sampleExam();
        dto.setLastName("");

        mockMvc.perform(put("/api/medical-exams/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleExam());

        mockMvc.perform(get("/api/medical-exams/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.exam_id").exists())
                .andExpect(jsonPath("$.created_date").exists())
                .andExpect(jsonPath("$.updated_date").exists())
                .andExpect(jsonPath("$.last_name").exists())
                .andExpect(jsonPath("$.first_name").exists())
                .andExpect(jsonPath("$.findings_a").exists())
                .andExpect(jsonPath("$.findings_b").exists())
                .andExpect(jsonPath("$.findings_c").exists())
                .andExpect(jsonPath("$.medical_history").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.examId").doesNotExist())
                .andExpect(jsonPath("$.createdDate").doesNotExist())
                .andExpect(jsonPath("$.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.lastName").doesNotExist())
                .andExpect(jsonPath("$.firstName").doesNotExist())
                .andExpect(jsonPath("$.findingsA").doesNotExist())
                .andExpect(jsonPath("$.findingsB").doesNotExist())
                .andExpect(jsonPath("$.findingsC").doesNotExist())
                .andExpect(jsonPath("$.medicalHistory").doesNotExist());
    }
}
