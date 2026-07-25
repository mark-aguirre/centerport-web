package com.centerport.profile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for SeafarerProfile CRUD operations.
 * Exposes endpoints at /api/profiles for listing, fetching, creating, and updating profiles.
 */
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class SeafarerProfileController {

    private final SeafarerProfileService service;

    /**
     * Returns all profiles sorted by created_date descending.
     * Supports optional {@code limit} query param to cap the number of results.
     */
    @GetMapping
    public List<SeafarerProfileDto> list(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer limit) {
        List<SeafarerProfileDto> profiles = service.findAll();
        if (limit != null && limit > 0 && limit < profiles.size()) {
            return profiles.subList(0, limit);
        }
        return profiles;
    }

    /**
     * Returns a single profile by UUID. Throws 404 if not found.
     */
    @GetMapping("/{id}")
    public SeafarerProfileDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new profile. Validates the request body (last_name required).
     * Returns 201 with the created profile including server-generated system fields.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SeafarerProfileDto create(@Valid @RequestBody SeafarerProfileDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing profile. Validates the request body (last_name required).
     * Returns 200 with the updated profile. Throws 404 if not found.
     */
    @PutMapping("/{id}")
    public SeafarerProfileDto update(@PathVariable UUID id, @Valid @RequestBody SeafarerProfileDto dto) {
        return service.update(id, dto);
    }
}
