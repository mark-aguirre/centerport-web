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
 * REST controller for {@link FecalysisRepeatTest} CRUD operations.
 *
 * Nested under a laboratory report at:
 * {@code /api/laboratory-reports/{reportId}/fecalysis-repeat-tests}
 *
 * Endpoints:
 * - {@code GET  /}      — list all repeat tests for a report
 * - {@code GET  /{id}}  — get a single repeat test by UUID
 * - {@code POST /}      — create a new repeat test
 * - {@code PUT  /{id}}  — update an existing repeat test
 * - {@code DELETE /{id}} — delete a repeat test
 *
 * @see FecalysisRepeatTestService
 * @see FecalysisRepeatTestDto
 */
@Slf4j
@RestController
@RequestMapping("/api/laboratory-reports/{reportId}/fecalysis-repeat-tests")
@RequiredArgsConstructor
@Tag(name = "Fecalysis Repeat Tests", description = "CRUD for fecalysis repeat test results")
public class FecalysisRepeatTestController {

    private final FecalysisRepeatTestService service;

    @GetMapping
    @Operation(summary = "List all fecalysis repeat tests for a laboratory report")
    public ResponseEntity<ApiResponse<List<FecalysisRepeatTestDto>>> listByReport(
            @PathVariable UUID reportId) {
        List<FecalysisRepeatTestDto> results = service.findByReportId(reportId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single fecalysis repeat test by UUID")
    public ResponseEntity<ApiResponse<FecalysisRepeatTestDto>> getById(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        FecalysisRepeatTestDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new fecalysis repeat test")
    public ResponseEntity<ApiResponse<FecalysisRepeatTestDto>> create(
            @PathVariable UUID reportId,
            @Valid @RequestBody FecalysisRepeatTestDto dto) {

        FecalysisRepeatTestDto created = service.create(reportId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Fecalysis repeat test created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing fecalysis repeat test")
    public ResponseEntity<ApiResponse<FecalysisRepeatTestDto>> update(
            @PathVariable UUID reportId,
            @PathVariable UUID id,
            @Valid @RequestBody FecalysisRepeatTestDto dto) {

        FecalysisRepeatTestDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Fecalysis repeat test updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a fecalysis repeat test")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Fecalysis repeat test deleted successfully"));
    }
}
