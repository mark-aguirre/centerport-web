package com.centerport.mlc;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for MlcRecord CRUD operations.
 * Exposes endpoints at /api/mlc-records for listing, fetching, creating, and updating MLC records.
 */
@RestController
@RequestMapping("/api/mlc-records")
@RequiredArgsConstructor
public class MlcRecordController {

    private final MlcRecordService service;

    /**
     * Returns all MLC records sorted by created_date descending.
     * Supports optional {@code limit} query param to cap the number of results.
     */
    @GetMapping
    public List<MlcRecordDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        List<MlcRecordDto> records = service.findAll();
        if (limit != null && limit > 0 && limit < records.size()) {
            return records.subList(0, limit);
        }
        return records;
    }

    /**
     * Returns a single MLC record by UUID. Throws 404 if not found.
     */
    @GetMapping("/{id}")
    public MlcRecordDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new MLC record. Validates the request body (last_name required).
     * Returns 201 with the created record including server-generated system fields.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MlcRecordDto create(@Valid @RequestBody MlcRecordDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing MLC record. Validates the request body (last_name required).
     * Returns 200 with the updated record. Throws 404 if not found.
     */
    @PutMapping("/{id}")
    public MlcRecordDto update(@PathVariable UUID id, @Valid @RequestBody MlcRecordDto dto) {
        return service.update(id, dto);
    }
}
