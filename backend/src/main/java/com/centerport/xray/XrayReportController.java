package com.centerport.xray;

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
 * REST controller for {@link XrayReport} CRUD operations.
 *
 * Exposes endpoints at {@code /api/xray-reports} for listing, fetching,
 * creating, and updating x-ray report records. All responses are wrapped
 * in {@link ApiResponse} for consistent API envelope formatting.
 *
 * Endpoints:
 * - {@code GET  /}               — paginated list with optional keyword search
 * - {@code GET  /by-profile/{id}} — all reports for a seafarer profile
 * - {@code GET  /{id}}           — single report by UUID
 * - {@code POST /}               — create a new report
 * - {@code PUT  /{id}}           — update an existing report
 *
 * @see XrayReportService
 * @see XrayReportDto
 */
@Slf4j
@RestController
@RequestMapping("/api/xray-reports")
@RequiredArgsConstructor
@Tag(name = "X-Ray Reports", description = "CRUD operations for x-ray reports")
// Method-level guard, in addition to the URL rule in SecurityConfig. Only the
// Radiology staff and administrators may touch x-ray reports.
@PreAuthorize("hasAnyRole('ADMIN','RADIOLOGY')")
public class XrayReportController {

    private final XrayReportService service;

    @GetMapping
    @Operation(summary = "List all x-ray reports with pagination and optional search",
               description = "Returns paginated x-ray reports. Optionally filter by seafarer name or report ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<XrayReportDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or report ID")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<XrayReportDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all x-ray reports for a specific seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<List<XrayReportDto>>> getByProfile(
            @PathVariable UUID profileId) {
        List<XrayReportDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get x-ray report by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<XrayReportDto>> getById(@PathVariable UUID id) {
        XrayReportDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    @Operation(summary = "Create a new x-ray report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<XrayReportDto>> create(@Valid @RequestBody XrayReportDto dto) {
        XrayReportDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "X-Ray report created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing x-ray report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<XrayReportDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody XrayReportDto dto) {

        XrayReportDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "X-Ray report updated successfully"));
    }
}
