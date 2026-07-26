package com.centerport.medical;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.GlobalExceptionHandler;
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
                .andExpect(jsonPath("$.data.id").value("22222222-2222-2222-2222-222222222222"))
                .andExpect(jsonPath("$.data.exam_id").value("MED00000001"))
                .andExpect(jsonPath("$.data.last_name").value("Santos"))
                .andExpect(jsonPath("$.data.findings_a.headache").value(true))
                .andExpect(jsonPath("$.data.findings_a.dizziness").value(false))
                .andExpect(jsonPath("$.data.questionnaire.q1").value("yes"))
                .andExpect(jsonPath("$.data.medical_history.diabetes").value("none"));
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
                .andExpect(jsonPath("$.detail").isNotEmpty());
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
                .andExpect(jsonPath("$.data.id").value(id.toString()))
                .andExpect(jsonPath("$.data.last_name").value("Santos"))
                .andExpect(jsonPath("$.data.exam_id").value("MED00000001"));
    }

    @Test
    void getMissingExam_returns404() throws Exception {
        UUID id = UUID.fromString("99999999-9999-9999-9999-999999999999");
        when(service.findById(id)).thenThrow(new NotFoundException("MedicalExam", id));

        mockMvc.perform(get("/api/medical-exams/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Resource Not Found"))
                .andExpect(jsonPath("$.detail", containsString("not found")));
    }

    @Test
    void getList_returns200WithArray() throws Exception {
        PagedResponse<MedicalExamDto> pagedResponse = PagedResponse.<MedicalExamDto>builder()
                .content(List.of(sampleExam(), sampleExam()))
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

        mockMvc.perform(get("/api/medical-exams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content", hasSize(2)));
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
                .andExpect(jsonPath("$.data.last_name").value("Garcia"));
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
                .andExpect(jsonPath("$.detail").isNotEmpty());
    }

    @Test
    void responseUsesSnakeCaseFieldNames() throws Exception {
        UUID id = UUID.fromString("22222222-2222-2222-2222-222222222222");
        when(service.findById(id)).thenReturn(sampleExam());

        mockMvc.perform(get("/api/medical-exams/{id}", id))
                .andExpect(status().isOk())
                // Verify snake_case fields are present
                .andExpect(jsonPath("$.data.exam_id").exists())
                .andExpect(jsonPath("$.data.created_date").exists())
                .andExpect(jsonPath("$.data.updated_date").exists())
                .andExpect(jsonPath("$.data.last_name").exists())
                .andExpect(jsonPath("$.data.first_name").exists())
                .andExpect(jsonPath("$.data.findings_a").exists())
                .andExpect(jsonPath("$.data.findings_b").exists())
                .andExpect(jsonPath("$.data.findings_c").exists())
                .andExpect(jsonPath("$.data.medical_history").exists())
                // Verify camelCase fields are NOT present
                .andExpect(jsonPath("$.data.examId").doesNotExist())
                .andExpect(jsonPath("$.data.createdDate").doesNotExist())
                .andExpect(jsonPath("$.data.updatedDate").doesNotExist())
                .andExpect(jsonPath("$.data.lastName").doesNotExist())
                .andExpect(jsonPath("$.data.firstName").doesNotExist())
                .andExpect(jsonPath("$.data.findingsA").doesNotExist())
                .andExpect(jsonPath("$.data.findingsB").doesNotExist())
                .andExpect(jsonPath("$.data.findingsC").doesNotExist())
                .andExpect(jsonPath("$.data.medicalHistory").doesNotExist());
    }
}
