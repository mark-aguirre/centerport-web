package com.centerport.profile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for SeafarerProfile CRUD operations.
 *
 * Exposes endpoints at {@code /api/profiles} for listing, fetching,
 * creating, and updating seafarer profiles.
 *
 * Endpoints:
 * - GET  /api/profiles       — list all profiles (optional {@code limit} param)
 * - GET  /api/profiles/{id}  — fetch a single profile by UUID
 * - POST /api/profiles       — create a new profile
 * - PUT  /api/profiles/{id}  — update an existing profile
 *
 * @see SeafarerProfileService
 */
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class SeafarerProfileController {

    private final SeafarerProfileService service;

    /**
     * Returns all profiles sorted by {@code createdDate} descending.
     * When a positive {@code limit} is supplied, at most that many profiles are returned.
     *
     * @param limit optional cap on the number of results (database-level)
     * @return list of profiles
     */
    @GetMapping
    public List<SeafarerProfileDto> list(@RequestParam(required = false) Integer limit) {
        if (limit != null && limit > 0) {
            return service.findAll(limit);
        }
        return service.findAll();
    }

    /**
     * Returns a single profile by UUID.
     *
     * @param id the profile UUID
     * @return the matching profile
     */
    @GetMapping("/{id}")
    public SeafarerProfileDto getById(@PathVariable UUID id) {
        return service.findById(id);
    }

    /**
     * Creates a new profile. Validates the request body ({@code lastName} required).
     * Returns 201 with the created profile including server-generated system fields.
     *
     * @param dto the profile data
     * @return the persisted profile DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SeafarerProfileDto create(@Valid @RequestBody SeafarerProfileDto dto) {
        return service.create(dto);
    }

    /**
     * Updates an existing profile. Validates the request body ({@code lastName} required).
     * Returns 200 with the updated profile.
     *
     * @param id  the profile UUID
     * @param dto the updated profile data
     * @return the updated profile DTO
     */
    @PutMapping("/{id}")
    public SeafarerProfileDto update(@PathVariable UUID id, @Valid @RequestBody SeafarerProfileDto dto) {
        return service.update(id, dto);
    }
}
