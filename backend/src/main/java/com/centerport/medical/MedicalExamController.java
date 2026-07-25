package com.centerport.medical;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for MedicalExam CRUD operations.
 *
 * Exposes endpoints under {@code /api/medical-exams} for listing, fetching,
 * creating, and updating medical examination records.
 *
 * Pagination:
 * The list endpoint accepts an optional {@code limit} query parameter to cap
 * the number of results returned. Results are always sorted by creation date
 * descending (most recent first).
 *
 * Validation:
 * Create and update operations validate the request body via Jakarta Bean
 * Validation — at minimum, {@code last_name} is required.
 *
 * @see MedicalExamService
 * @see MedicalExamDto
 */
@Slf4j
@RestController
@RequestMapping("/api/medical-exams")
@RequiredArgsConstructor
public class MedicalExamController {

    private final MedicalExamService service;

    /**
     * Returns all medical exams sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of exam DTOs, possibly truncated to {@code limit}
     */
    @GetMapping
    public List<MedicalExamDto> list(@RequestParam(required = false) Integer limit) {
        log.debug("GET /api/medical-exams — limit: {}", limit);
        List<MedicalExamDto> results = service.findAll(limit);
        log.debug("Medical exams listed — count: {}", results.size());
        return results;
    }

    /**
     * Returns a single medical exam by its UUID.
     *
     * @param id the exam's primary key
     * @return the matching exam DTO
     * @throws com.centerport.common.NotFoundException if no exam exists
     *         with the given ID
     */
    @GetMapping("/{id}")
    public MedicalExamDto getById(@PathVariable UUID id) {
        log.debug("GET /api/medical-exams/{} — fetching by id", id);
        return service.findById(id);
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
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalExamDto create(@Valid @RequestBody MedicalExamDto dto) {
        log.info("Medical exam creation requested — lastName: {}", dto.getLastName());
        MedicalExamDto created = service.create(dto);
        log.info("Medical exam created — examId: {}, id: {}", created.getExamId(), created.getId());
        return created;
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
     * @throws com.centerport.common.NotFoundException if no exam exists
     *         with the given ID
     */
    @PutMapping("/{id}")
    public MedicalExamDto update(@PathVariable UUID id,
                                 @Valid @RequestBody MedicalExamDto dto) {
        log.info("Medical exam update requested — id: {}", id);
        MedicalExamDto updated = service.update(id, dto);
        log.info("Medical exam updated — examId: {}, id: {}", updated.getExamId(), id);
        return updated;
    }
}
