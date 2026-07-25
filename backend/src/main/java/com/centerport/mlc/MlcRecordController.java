package com.centerport.mlc;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Exposes endpoints under {@code /api/mlc-records} for listing, fetching,
 * creating, and updating MLC records.
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
 * @see MlcRecordService
 * @see MlcRecordDto
 */
@Slf4j
@RestController
@RequestMapping("/api/mlc-records")
@RequiredArgsConstructor
public class MlcRecordController {

    private final MlcRecordService service;

    /**
     * Returns all MLC records sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of MLC record DTOs, possibly truncated to {@code limit}
     */
    @GetMapping
    public List<MlcRecordDto> list(@RequestParam(required = false) Integer limit) {
        log.debug("GET /api/mlc-records — limit: {}", limit);
        List<MlcRecordDto> results = service.findAll(limit);
        log.debug("MLC records listed — count: {}", results.size());
        return results;
    }

    /**
     * Returns a single MLC record by its UUID.
     *
     * @param id the record's primary key
     * @return the matching MLC record DTO
     * @throws com.centerport.common.NotFoundException if no record exists
     *         with the given ID
     */
    @GetMapping("/{id}")
    public MlcRecordDto getById(@PathVariable UUID id) {
        log.debug("GET /api/mlc-records/{} — fetching by id", id);
        return service.findById(id);
    }

    /**
     * Creates a new MLC record.
     *
     * Client-supplied system fields (id, mlcId, createdDate, updatedDate) are
     * ignored. A business ID with prefix MLC is generated server-side.
     *
     * @param dto the record data to persist
     * @return the created record including server-generated system fields
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MlcRecordDto create(@Valid @RequestBody MlcRecordDto dto) {
        log.info("MLC record creation requested — lastName: {}", dto.getLastName());
        MlcRecordDto created = service.create(dto);
        log.info("MLC record created — mlcId: {}, id: {}", created.getMlcId(), created.getId());
        return created;
    }

    /**
     * Updates an existing MLC record.
     *
     * System fields (id, mlcId, createdDate) are preserved from the existing
     * entity. {@code updatedDate} is refreshed automatically.
     *
     * @param id  the record's primary key
     * @param dto the updated record data
     * @return the updated MLC record DTO
     * @throws com.centerport.common.NotFoundException if no record exists
     *         with the given ID
     */
    @PutMapping("/{id}")
    public MlcRecordDto update(@PathVariable UUID id,
                               @Valid @RequestBody MlcRecordDto dto) {
        log.info("MLC record update requested — id: {}", id);
        MlcRecordDto updated = service.update(id, dto);
        log.info("MLC record updated — mlcId: {}, id: {}", updated.getMlcId(), id);
        return updated;
    }
}
