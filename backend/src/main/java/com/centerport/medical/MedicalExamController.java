package com.centerport.medical;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

/**
 * REST controller for MedicalExam CRUD operations.
 *
 * Exposes endpoints under {@code /api/medical-exams} for listing, fetching,
 * creating, and updating medical examination records.
 *
 * @see MedicalExamService
 * @see MedicalExamDto
 */
@Slf4j
@RestController
@RequestMapping("/api/medical-exams")
@RequiredArgsConstructor
@Tag(name = "Medical Exams", description = "CRUD operations for pre-employment medical examination records")
public class MedicalExamController {

    private final MedicalExamService service;

    /**
     * Returns paginated medical exams sorted by creation date descending.
     *
     * @param pageable pagination and sorting parameters
     * @return paged list of exam DTOs
     */
    @GetMapping
    @Operation(summary = "List all medical exams with pagination",
               description = "Returns paginated medical exams. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Exams retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<MedicalExamDto>>> list(
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<MedicalExamDto> page = service.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns a single medical exam by its UUID.
     *
     * @param id the exam's primary key
     * @return the matching exam DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get medical exam by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Exam found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Exam not found")
    })
    public ResponseEntity<ApiResponse<MedicalExamDto>> getById(@PathVariable UUID id) {
        MedicalExamDto exam = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(exam));
    }

    /**
     * Creates a new medical exam record.
     *
     * Client-supplied system fields (id, examId, createdDate, updatedDate) are
     * ignored. A business ID with prefix MED is generated server-side.
     *
     * @param dto the exam data to persist
     * @return the created exam including server-generated system fields
     */
    @PostMapping
    @Operation(summary = "Create a new medical exam record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Exam created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MedicalExamDto>> create(@Valid @RequestBody MedicalExamDto dto) {
        log.debug("Medical exam creation requested — lastName: {}", dto.getLastName());
        MedicalExamDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Medical exam created successfully"));
    }

    /**
     * Updates an existing medical exam record.
     *
     * System fields (id, examId, createdDate) are preserved from the existing
     * entity. {@code updatedDate} is refreshed automatically.
     *
     * @param id  the exam's primary key
     * @param dto the updated exam data
     * @return the updated exam DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing medical exam record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Exam updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Exam not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MedicalExamDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody MedicalExamDto dto) {

        log.debug("Medical exam update requested — id: {}", id);
        MedicalExamDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medical exam updated successfully"));
    }
}
