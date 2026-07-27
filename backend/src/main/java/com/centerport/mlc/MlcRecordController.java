package com.centerport.mlc;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
 * REST controller for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Exposes endpoints under {@code /api/mlc-records} for listing, fetching,
 * creating, and updating MLC records.
 *
 * @see MlcRecordService
 * @see MlcRecordDto
 */
@Slf4j
@RestController
@RequestMapping("/api/mlc-records")
@RequiredArgsConstructor
@Tag(name = "MLC Records", description = "CRUD operations for Maritime Labour Convention medical records")
public class MlcRecordController {

    private final MlcRecordService service;

    /**
     * Returns paginated MLC records sorted by creation date descending.
     * Optionally filters by a search term matching the linked seafarer profile's
     * last name, first name, or the MLC ID.
     *
     * @param search   optional keyword to filter records (case-insensitive partial match)
     * @param pageable pagination and sorting parameters
     * @return paged list of MLC record DTOs
     */
    @GetMapping
    @Operation(summary = "List all MLC records with pagination and optional search",
               description = "Returns paginated MLC records. Optionally filter by seafarer name or MLC ID. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<MlcRecordDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or MLC ID (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<MlcRecordDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns a single MLC record by its UUID.
     *
     * @param id the record's primary key
     * @return the matching MLC record DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get MLC record by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<MlcRecordDto>> getById(@PathVariable UUID id) {
        MlcRecordDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    /**
     * Creates a new MLC record.
     *
     * @param dto the record data to persist
     * @return the created record including server-generated system fields
     */
    @PostMapping
    @Operation(summary = "Create a new MLC record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MlcRecordDto>> create(@Valid @RequestBody MlcRecordDto dto) {
        log.debug("MLC record creation requested — seafarerProfileId: {}", dto.getSeafarerProfileId());
        MlcRecordDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "MLC record created successfully"));
    }

    /**
     * Updates an existing MLC record.
     *
     * @param id  the record's primary key
     * @param dto the updated record data
     * @return the updated MLC record DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing MLC record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MlcRecordDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody MlcRecordDto dto) {

        log.debug("MLC record update requested — id: {}", id);
        MlcRecordDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "MLC record updated successfully"));
    }
}
