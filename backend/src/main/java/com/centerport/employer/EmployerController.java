package com.centerport.employer;

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
import java.util.List;
import java.util.UUID;

/**
 * REST controller for Employer CRUD operations.
 *
 * Exposes endpoints at {@code /api/employers} for listing, searching,
 * fetching, creating, and updating employer records. Used to populate the
 * employer selection field on profile and visit registration forms.
 *
 * @see EmployerService
 */
@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
@Tag(name = "Employers", description = "CRUD operations for employers / manning-agencies")
public class EmployerController {

    private final EmployerService service;

    /**
     * Returns paginated employers sorted by name ascending.
     * Optionally filters by a search term matching name.
     *
     * @param search   optional keyword to filter employers (case-insensitive partial match)
     * @param pageable pagination and sorting parameters
     * @return paged list of employers
     */
    @GetMapping
    @Operation(summary = "List all employers with pagination and optional search",
               description = "Returns paginated active employers. Optionally filter by name. Default sort: name ASC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Employers retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<EmployerDto>>> list(
            @Parameter(description = "Search keyword — matches name (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC)
            Pageable pageable) {

        PagedResponse<EmployerDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns all active employers matching the search keyword (unpaginated).
     * Designed for the employer selection field which needs a quick searchable
     * list without pagination complexity.
     *
     * @param keyword optional search term
     * @return list of matching active employers
     */
    @GetMapping("/search")
    @Operation(summary = "Search employers (unpaginated)",
               description = "Returns all active employers matching the keyword. Used by the employer selection field.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search results")
    })
    public ResponseEntity<ApiResponse<List<EmployerDto>>> search(
            @Parameter(description = "Search keyword — matches employer name")
            @RequestParam(required = false) String keyword) {

        List<EmployerDto> results = service.search(keyword);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /**
     * Returns a single employer record by UUID.
     *
     * @param id the employer UUID
     * @return the matching employer
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get employer by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Employer found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Employer not found")
    })
    public ResponseEntity<ApiResponse<EmployerDto>> getById(@PathVariable UUID id) {
        EmployerDto employer = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(employer));
    }

    /**
     * Creates a new employer record.
     * Returns 201 with the created record including server-generated system fields.
     *
     * @param dto the employer data
     * @return the persisted employer DTO
     */
    @PostMapping
    @Operation(summary = "Create a new employer record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Employer created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<EmployerDto>> create(@Valid @RequestBody EmployerDto dto) {
        EmployerDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Employer created successfully"));
    }

    /**
     * Updates an existing employer record.
     * Returns 200 with the updated record.
     *
     * @param id  the employer UUID
     * @param dto the updated employer data
     * @return the updated employer DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing employer record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Employer updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Employer not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<EmployerDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody EmployerDto dto) {

        EmployerDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employer updated successfully"));
    }
}
