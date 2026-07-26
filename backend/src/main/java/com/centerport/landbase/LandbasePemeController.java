package com.centerport.landbase;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
 * REST controller for LandbasePeme CRUD operations.
 *
 * Exposes endpoints at {@code /api/landbase-pemes} for listing, fetching,
 * creating, and updating pre-employment medical examination records.
 *
 * @see LandbasePemeService
 * @see LandbasePemeDto
 */
@Slf4j
@RestController
@RequestMapping("/api/landbase-pemes")
@RequiredArgsConstructor
@Tag(name = "Landbase PEMEs", description = "CRUD operations for land-based pre-employment medical examinations")
public class LandbasePemeController {

    private final LandbasePemeService service;

    /**
     * Returns paginated landbase PEMEs sorted by creation date descending.
     *
     * @param pageable pagination and sorting parameters
     * @return paged list of PEME records
     */
    @GetMapping
    @Operation(summary = "List all landbase PEMEs with pagination",
               description = "Returns paginated landbase PEME records. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<LandbasePemeDto>>> list(
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<LandbasePemeDto> page = service.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Retrieves a single landbase PEME by its UUID.
     *
     * @param id the record UUID
     * @return the matching PEME record
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get landbase PEME by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<LandbasePemeDto>> getById(@PathVariable UUID id) {
        LandbasePemeDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    /**
     * Creates a new landbase PEME record.
     *
     * @param dto the request body; {@code lastName} is required
     * @return the persisted record with server-generated fields populated
     */
    @PostMapping
    @Operation(summary = "Create a new landbase PEME record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<LandbasePemeDto>> create(@Valid @RequestBody LandbasePemeDto dto) {
        LandbasePemeDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Landbase PEME created successfully"));
    }

    /**
     * Updates an existing landbase PEME record.
     *
     * @param id  the UUID of the record to update
     * @param dto the request body; {@code lastName} is required
     * @return the updated record
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing landbase PEME record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<LandbasePemeDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody LandbasePemeDto dto) {

        LandbasePemeDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Landbase PEME updated successfully"));
    }
}
