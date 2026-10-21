package com.centerport.hiv;

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for {@link HivReport} CRUD operations.
 *
 * Exposes endpoints at {@code /api/hiv-reports} for listing, fetching,
 * creating, and updating HIV report records. All responses are wrapped
 * in {@link ApiResponse} for consistent API envelope formatting.
 *
 * Endpoints:
 * - {@code GET  /}               — paginated list with optional keyword search
 * - {@code GET  /by-profile/{id}} — all reports for a seafarer profile
 * - {@code GET  /{id}}           — single report by UUID
 * - {@code POST /}               — create a new report
 * - {@code PUT  /{id}}           — update an existing report
 *
 * @see HivReportService
 * @see HivReportDto
 */
@Slf4j
@RestController
@RequestMapping("/api/hiv-reports")
@RequiredArgsConstructor
@Tag(name = "HIV Reports", description = "CRUD operations for HIV reports")
// Method-level guard, in addition to the URL rule in SecurityConfig. Only the
// Laboratory staff and administrators may touch HIV reports.
@PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")
public class HivReportController {

    private final HivReportService service;

    @GetMapping
    @Operation(summary = "List all HIV reports with pagination and optional search",
               description = "Returns paginated HIV reports. Optionally filter by seafarer name or report ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<HivReportDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or report ID")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<HivReportDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all HIV reports for a specific seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<List<HivReportDto>>> getByProfile(
            @PathVariable UUID profileId) {
        List<HivReportDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get HIV report by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<HivReportDto>> getById(@PathVariable UUID id) {
        HivReportDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    @Operation(summary = "Create a new HIV report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<HivReportDto>> create(@Valid @RequestBody HivReportDto dto) {
        HivReportDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "HIV report created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing HIV report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<HivReportDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody HivReportDto dto) {

        HivReportDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "HIV report updated successfully"));
    }
}
