package com.centerport.laboratory.repeattest;

import com.centerport.common.dto.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for {@link HematologyRepeatTest} CRUD operations.
 *
 * Nested under a laboratory report at:
 * {@code /api/laboratory-reports/{reportId}/hematology-repeat-tests}
 *
 * Endpoints:
 * - {@code GET  /}      — list all repeat tests for a report
 * - {@code GET  /{id}}  — get a single repeat test by UUID
 * - {@code POST /}      — create a new repeat test
 * - {@code PUT  /{id}}  — update an existing repeat test
 * - {@code DELETE /{id}} — delete a repeat test
 *
 * @see HematologyRepeatTestService
 * @see HematologyRepeatTestDto
 */
@Slf4j
@RestController
@RequestMapping("/api/laboratory-reports/{reportId}/hematology-repeat-tests")
@RequiredArgsConstructor
@Tag(name = "Hematology Repeat Tests", description = "CRUD for hematology repeat test results")
public class HematologyRepeatTestController {

    private final HematologyRepeatTestService service;

    @GetMapping
    @Operation(summary = "List all hematology repeat tests for a laboratory report")
    public ResponseEntity<ApiResponse<List<HematologyRepeatTestDto>>> listByReport(
            @PathVariable UUID reportId) {
        List<HematologyRepeatTestDto> results = service.findByReportId(reportId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single hematology repeat test by UUID")
    public ResponseEntity<ApiResponse<HematologyRepeatTestDto>> getById(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        HematologyRepeatTestDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new hematology repeat test")
    public ResponseEntity<ApiResponse<HematologyRepeatTestDto>> create(
            @PathVariable UUID reportId,
            @Valid @RequestBody HematologyRepeatTestDto dto) {

        HematologyRepeatTestDto created = service.create(reportId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Hematology repeat test created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing hematology repeat test")
    public ResponseEntity<ApiResponse<HematologyRepeatTestDto>> update(
            @PathVariable UUID reportId,
            @PathVariable UUID id,
            @Valid @RequestBody HematologyRepeatTestDto dto) {

        HematologyRepeatTestDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Hematology repeat test updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a hematology repeat test")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Hematology repeat test deleted successfully"));
    }
}
