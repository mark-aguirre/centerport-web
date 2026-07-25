package com.centerport.panama;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for Panama certificate CRUD operations.
 *
 * Exposes endpoints under {@code /api/panama-certificates} for listing,
 * fetching, creating, and updating Panama maritime medical certificates.
 *
 * Pagination:
 * The list endpoint accepts an optional {@code limit} query parameter to cap
 * the number of results returned. Results are always sorted by creation date
 * descending (most recent first).
 *
 * Validation:
 * Create and update operations validate the request body via Jakarta Bean
 * Validation — at minimum, {@code full_name} is required.
 *
 * @see PanamaCertificateService
 * @see PanamaCertificateDto
 */
@Slf4j
@RestController
@RequestMapping("/api/panama-certificates")
@RequiredArgsConstructor
public class PanamaCertificateController {

    private final PanamaCertificateService service;

    /**
     * Returns all Panama certificates sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of Panama certificate DTOs, possibly truncated to {@code limit}
     */
    @GetMapping
    public List<PanamaCertificateDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        log.debug("GET /api/panama-certificates — limit: {}", limit);
        List<PanamaCertificateDto> results = service.findAll(limit);
        log.debug("Panama certificates listed — count: {}", results.size());
        return results;
    }

    /**
     * Returns a single Panama certificate by its UUID.
     *
     * @param id the certificate's primary key
     * @return the matching Panama certificate DTO
     * @throws com.centerport.common.NotFoundException if no certificate exists
     *         with the given ID
     */
    @GetMapping("/{id}")
    public PanamaCertificateDto getById(@PathVariable UUID id) {
        log.debug("GET /api/panama-certificates/{} — fetching by id", id);
        return service.findById(id);
    }

    /**
     * Creates a new Panama certificate.
     *
     * Client-supplied system fields (id, panamaId, createdDate, updatedDate)
     * are ignored. A business ID with prefix PAN is generated server-side.
     *
     * @param dto the certificate data to persist
     * @return the created certificate including server-generated system fields
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PanamaCertificateDto create(@Valid @RequestBody PanamaCertificateDto dto) {
        log.info("Panama certificate creation requested — fullName: {}", dto.getFullName());
        PanamaCertificateDto created = service.create(dto);
        log.info("Panama certificate created — panamaId: {}, id: {}",
                created.getPanamaId(), created.getId());
        return created;
    }

    /**
     * Updates an existing Panama certificate.
     *
     * System fields (id, panamaId, createdDate) are preserved from the existing
     * entity. {@code updatedDate} is refreshed automatically.
     *
     * @param id  the certificate's primary key
     * @param dto the updated certificate data
     * @return the updated Panama certificate DTO
     * @throws com.centerport.common.NotFoundException if no certificate exists
     *         with the given ID
     */
    @PutMapping("/{id}")
    public PanamaCertificateDto update(@PathVariable UUID id,
                                       @Valid @RequestBody PanamaCertificateDto dto) {
        log.info("Panama certificate update requested — id: {}", id);
        PanamaCertificateDto updated = service.update(id, dto);
        log.info("Panama certificate updated — panamaId: {}, id: {}",
                updated.getPanamaId(), id);
        return updated;
    }
}
