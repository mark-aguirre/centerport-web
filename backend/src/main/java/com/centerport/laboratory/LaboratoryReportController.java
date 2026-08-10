package com.centerport.laboratory;

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
import java.util.List;
import java.util.UUID;

/**
 * REST controller for {@link LaboratoryReport} CRUD operations.
 *
 * Exposes endpoints at {@code /api/laboratory-reports} for listing, fetching,
 * creating, and updating laboratory report records. All responses are wrapped
 * in {@link ApiResponse} for consistent API envelope formatting.
 *
 * Endpoints:
 * - {@code GET  /}               — paginated list with optional keyword search
 * - {@code GET  /by-profile/{id}} — all reports for a seafarer profile
 * - {@code GET  /{id}}           — single report by UUID
 * - {@code POST /}               — create a new report
 * - {@code PUT  /{id}}           — update an existing report
 *
 * @see LaboratoryReportService
 * @see LaboratoryReportDto
 */
@Slf4j
@RestController
@RequestMapping("/api/laboratory-reports")
@RequiredArgsConstructor
@Tag(name = "Laboratory Reports", description = "CRUD operations for laboratory reports")
public class LaboratoryReportController {

    private final LaboratoryReportService service;

    @GetMapping
    @Operation(summary = "List all laboratory reports with pagination and optional search",
               description = "Returns paginated laboratory reports. Optionally filter by seafarer name or report ID.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<LaboratoryReportDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or report ID")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<LaboratoryReportDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all laboratory reports for a specific seafarer profile")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<List<LaboratoryReportDto>>> getByProfile(
            @PathVariable UUID profileId) {
        List<LaboratoryReportDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get laboratory report by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<LaboratoryReportDto>> getById(@PathVariable UUID id) {
        LaboratoryReportDto record = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    @Operation(summary = "Create a new laboratory report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<LaboratoryReportDto>> create(@Valid @RequestBody LaboratoryReportDto dto) {
        LaboratoryReportDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Laboratory report created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing laboratory report")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<LaboratoryReportDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody LaboratoryReportDto dto) {

        LaboratoryReportDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Laboratory report updated successfully"));
    }
}
