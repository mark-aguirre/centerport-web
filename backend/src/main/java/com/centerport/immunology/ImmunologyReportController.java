package com.centerport.immunology;

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
 * REST controller for {@link ImmunologyReport} CRUD operations.
 *
 * Exposes endpoints at {@code /api/immunology-reports} for listing, fetching,
 * creating, and updating immunology report records. All responses are wrapped
 * in {@link ApiResponse} for consistent API envelope formatting.
 *
 * Endpoints:
 * - {@code GET  /}               — paginated list with optional keyword search
 * - {@code GET  /by-profile/{id}} — all reports for a seafarer profile
 * - {@code GET  /{id}}           — single report by UUID
 * - {@code POST /}               — create a new report
 * - {@code PUT  /{id}}           — update an existing report
 *
 * @see ImmunologyReportService
 * @see ImmunologyReportDto
 */
@Slf4j
@RestController
@RequestMapping("/api/immunology-reports")
@RequiredArgsConstructor
@Tag(name = "Immunology Reports", description = "CRUD operations for immunology reports")
// Method-level guard, in addition to the URL rule in SecurityConfig. Only the
// Laboratory staff and administrators may touch immunology reports.
@PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")
public class ImmunologyReportController {

    private final ImmunologyReportService service;

    @GetMapping
    @Operation(summary = "List all immunology reports with pagination and optional search",
               description = "Returns paginated immunology reports. Optionally filter by seafarer name or report ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<ImmunologyReportDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or report ID")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<ImmunologyReportDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all immunology reports for a specific seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<List<ImmunologyReportDto>>> getByProfile(
            @PathVariable UUID profileId) {
        List<ImmunologyReportDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get immunology report by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<ImmunologyReportDto>> getById(@PathVariable UUID id) {
        ImmunologyReportDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    @Operation(summary = "Create a new immunology report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ImmunologyReportDto>> create(@Valid @RequestBody ImmunologyReportDto dto) {
        ImmunologyReportDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Immunology report created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing immunology report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ImmunologyReportDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ImmunologyReportDto dto) {

        ImmunologyReportDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Immunology report updated successfully"));
    }
}
