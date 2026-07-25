package com.centerport.medical;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for MedicalExam CRUD operations.
 * Exposes endpoints at /api/medical-exams for listing, fetching, creating, and updating exams.
 */
@RestController
@RequestMapping("/api/medical-exams")
@RequiredArgsConstructor
public class MedicalExamController {

    private final MedicalExamService service;

    /**
     * Returns all medical exams sorted by created_date descending.
     * Supports optional {@code limit} query param to cap the number of results.
     */
    @GetMapping
    public List<MedicalExamDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        List<MedicalExamDto> exams = service.findAll();
        if (limit != null && limit > 0 && limit < exams.size()) {
            return exams.subList(0, limit);
        }
        return exams;
    }

    /**
     * Returns a single medical exam by UUID. Throws 404 if not found.
     */
    @GetMapping("/{id}")
    public MedicalExamDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new medical exam. Validates the request body (last_name required).
     * Returns 201 with the created exam including server-generated system fields.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalExamDto create(@Valid @RequestBody MedicalExamDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing medical exam. Validates the request body (last_name required).
     * Returns 200 with the updated exam. Throws 404 if not found.
     */
    @PutMapping("/{id}")
    public MedicalExamDto update(@PathVariable UUID id, @Valid @RequestBody MedicalExamDto dto) {
        return service.update(id, dto);
    }
}
