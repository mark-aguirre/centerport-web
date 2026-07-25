package com.centerport.landbase;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for LandbasePeme CRUD operations.
 *
 * Exposes endpoints at {@code /api/landbase-pemes} for listing, fetching,
 * creating, and updating pre-employment medical examination records.
 * All persistence and business logic is delegated to {@link LandbasePemeService}.
 *
 * Sorting:
 * Results are returned sorted by {@code createdDate} descending (handled by the
 * service layer). An optional {@code limit} query parameter caps the result count.
 *
 * @see LandbasePemeService
 * @see LandbasePemeDto
 */
@Slf4j
@RestController
@RequestMapping("/api/landbase-pemes")
@RequiredArgsConstructor
public class LandbasePemeController {

    private final LandbasePemeService service;

    /**
     * Lists all landbase PEMEs sorted by creation date descending.
     *
     * @param limit optional cap on the number of results returned
     * @return list of PEME records, possibly truncated to {@code limit}
     */
    @GetMapping
    public List<LandbasePemeDto> list(@RequestParam(required = false) Integer limit) {
        log.debug("GET /api/landbase-pemes — limit: {}", limit);
        List<LandbasePemeDto> results = service.findAll(limit);
        log.debug("Landbase PEME list returned — count: {}", results.size());
        return results;
    }

    /**
     * Retrieves a single landbase PEME by its UUID.
     *
     * @param id the record UUID
     * @return the matching PEME record
     * @throws com.centerport.common.NotFoundException if no record exists for the given ID
     */
    @GetMapping("/{id}")
    public LandbasePemeDto getById(@PathVariable UUID id) {
        log.debug("GET /api/landbase-pemes/{}", id);
        return service.findById(id);
    }

    /**
     * Creates a new landbase PEME record.
     *
     * System fields (id, pemeId, createdDate, updatedDate) are generated server-side
     * and any client-supplied values are ignored.
     *
     * @param dto the request body; {@code lastName} is required
     * @return the persisted record with server-generated fields populated
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LandbasePemeDto create(@Valid @RequestBody LandbasePemeDto dto) {
        log.debug("POST /api/landbase-pemes — lastName: {}", dto.getLastName());
        return service.create(dto);
    }

    /**
     * Updates an existing landbase PEME record.
     *
     * Mutable data fields are replaced; system fields are preserved.
     *
     * @param id  the UUID of the record to update
     * @param dto the request body; {@code lastName} is required
     * @return the updated record
     * @throws com.centerport.common.NotFoundException if no record exists for the given ID
     */
    @PutMapping("/{id}")
    public LandbasePemeDto update(@PathVariable UUID id, @Valid @RequestBody LandbasePemeDto dto) {
        log.debug("PUT /api/landbase-pemes/{}", id);
        return service.update(id, dto);
    }
}
