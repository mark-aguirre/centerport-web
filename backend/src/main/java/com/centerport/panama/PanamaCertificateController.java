package com.centerport.panama;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for PanamaCertificate CRUD operations.
 * Exposes endpoints at /api/panama-certificates for listing, fetching, creating, and updating.
 */
@RestController
@RequestMapping("/api/panama-certificates")
@RequiredArgsConstructor
public class PanamaCertificateController {

    private final PanamaCertificateService service;

    /**
     * Returns all Panama certificates sorted by created_date descending.
     * Supports optional {@code limit} query param to cap the number of results.
     */
    @GetMapping
    public List<PanamaCertificateDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        List<PanamaCertificateDto> certificates = service.findAll();
        if (limit != null && limit > 0 && limit < certificates.size()) {
            return certificates.subList(0, limit);
        }
        return certificates;
    }

    /**
     * Returns a single Panama certificate by UUID. Throws 404 if not found.
     */
    @GetMapping("/{id}")
    public PanamaCertificateDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new Panama certificate. Validates the request body (full_name required).
     * Returns 201 with the created certificate including server-generated system fields.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PanamaCertificateDto create(@Valid @RequestBody PanamaCertificateDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing Panama certificate. Validates the request body (full_name required).
     * Returns 200 with the updated certificate. Throws 404 if not found.
     */
    @PutMapping("/{id}")
    public PanamaCertificateDto update(@PathVariable UUID id, @Valid @RequestBody PanamaCertificateDto dto) {
        return service.update(id, dto);
    }
}
