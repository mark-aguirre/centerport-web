package com.centerport.landbase;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for LandbasePeme CRUD operations.
 * Exposes endpoints at /api/landbase-pemes for listing, fetching, creating, and updating records.
 */
@RestController
@RequestMapping("/api/landbase-pemes")
@RequiredArgsConstructor
public class LandbasePemeController {

    private final LandbasePemeService service;

    /**
     * Returns all landbase PEMEs sorted by created_date descending.
     * Supports optional {@code limit} query param to cap the number of results.
     */
    @GetMapping
    public List<LandbasePemeDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        List<LandbasePemeDto> pemes = service.findAll();
        if (limit != null && limit > 0 && limit < pemes.size()) {
            return pemes.subList(0, limit);
        }
        return pemes;
    }

    /**
     * Returns a single landbase PEME by UUID. Throws 404 if not found.
     */
    @GetMapping("/{id}")
    public LandbasePemeDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new landbase PEME. Validates the request body (last_name required).
     * Returns 201 with the created record including server-generated system fields.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LandbasePemeDto create(@Valid @RequestBody LandbasePemeDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing landbase PEME. Validates the request body (last_name required).
     * Returns 200 with the updated record. Throws 404 if not found.
     */
    @PutMapping("/{id}")
    public LandbasePemeDto update(@PathVariable UUID id, @Valid @RequestBody LandbasePemeDto dto) {
        return service.update(id, dto);
    }
}
