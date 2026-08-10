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
 * REST controller for {@link UrinalysisRepeatTest} CRUD operations.
 *
 * Nested under a laboratory report at:
 * {@code /api/laboratory-reports/{reportId}/urinalysis-repeat-tests}
 *
 * Endpoints:
 * - {@code GET  /}      — list all repeat tests for a report
 * - {@code GET  /{id}}  — get a single repeat test by UUID
 * - {@code POST /}      — create a new repeat test
 * - {@code PUT  /{id}}  — update an existing repeat test
 * - {@code DELETE /{id}} — delete a repeat test
 *
 * @see UrinalysisRepeatTestService
 * @see UrinalysisRepeatTestDto
 */
@Slf4j
@RestController
@RequestMapping("/api/laboratory-reports/{reportId}/urinalysis-repeat-tests")
@RequiredArgsConstructor
@Tag(name = "Urinalysis Repeat Tests", description = "CRUD for urinalysis repeat test results")
public class UrinalysisRepeatTestController {

    private final UrinalysisRepeatTestService service;

    @GetMapping
    @Operation(summary = "List all urinalysis repeat tests for a laboratory report")
    public ResponseEntity<ApiResponse<List<UrinalysisRepeatTestDto>>> listByReport(
            @PathVariable UUID reportId) {
        List<UrinalysisRepeatTestDto> results = service.findByReportId(reportId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single urinalysis repeat test by UUID")
    public ResponseEntity<ApiResponse<UrinalysisRepeatTestDto>> getById(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        UrinalysisRepeatTestDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new urinalysis repeat test")
    public ResponseEntity<ApiResponse<UrinalysisRepeatTestDto>> create(
            @PathVariable UUID reportId,
            @Valid @RequestBody UrinalysisRepeatTestDto dto) {

        UrinalysisRepeatTestDto created = service.create(reportId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Urinalysis repeat test created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing urinalysis repeat test")
    public ResponseEntity<ApiResponse<UrinalysisRepeatTestDto>> update(
            @PathVariable UUID reportId,
            @PathVariable UUID id,
            @Valid @RequestBody UrinalysisRepeatTestDto dto) {

        UrinalysisRepeatTestDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Urinalysis repeat test updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a urinalysis repeat test")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Urinalysis repeat test deleted successfully"));
    }
}
