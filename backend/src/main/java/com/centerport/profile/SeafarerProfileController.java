package com.centerport.profile;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

/**
 * REST controller for SeafarerProfile CRUD operations.
 *
 * Exposes endpoints at {@code /api/profiles} for listing, fetching,
 * creating, and updating seafarer profiles.
 *
 * @see SeafarerProfileService
 */
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Tag(name = "Seafarer Profiles", description = "CRUD operations for seafarer demographic and employment data")
public class SeafarerProfileController {

    private final SeafarerProfileService service;

    /**
     * Returns paginated profiles sorted by creation date descending.
     * Optionally filters by a search term matching last name, first name, or profile ID.
     *
     * @param search   optional keyword to filter profiles (case-insensitive partial match)
     * @param pageable pagination and sorting parameters
     * @return paged list of profiles
     */
    @GetMapping
    @Operation(summary = "List all profiles with pagination and optional search",
               description = "Returns paginated seafarer profiles. Optionally filter by name or profile ID. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profiles retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<SeafarerProfileDto>>> list(
            @Parameter(description = "Search keyword — matches last name, first name, or profile ID (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<SeafarerProfileDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns a single profile by UUID.
     *
     * @param id the profile UUID
     * @return the matching profile
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get profile by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<ApiResponse<SeafarerProfileDto>> getById(@PathVariable UUID id) {
        SeafarerProfileDto profile = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * Creates a new profile. Validates the request body ({@code lastName} required).
     * Returns 201 with the created profile including server-generated system fields.
     *
     * @param dto the profile data
     * @return the persisted profile DTO
     */
    @PostMapping
    @Operation(summary = "Create a new seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Profile created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<SeafarerProfileDto>> create(@Valid @RequestBody SeafarerProfileDto dto) {
        SeafarerProfileDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Profile created successfully"));
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
    @Operation(summary = "Update an existing seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Profile not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<SeafarerProfileDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody SeafarerProfileDto dto) {

        SeafarerProfileDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }
}
