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
 * REST controller for {@link ChemistryRepeatTest} CRUD operations.
 *
 * Nested under a laboratory report at:
 * {@code /api/laboratory-reports/{reportId}/chemistry-repeat-tests}
 *
 * Endpoints:
 * - {@code GET  /}      — list all repeat tests for a report
 * - {@code GET  /{id}}  — get a single repeat test by UUID
 * - {@code POST /}      — create a new repeat test
 * - {@code PUT  /{id}}  — update an existing repeat test
 * - {@code DELETE /{id}} — delete a repeat test
 *
 * @see ChemistryRepeatTestService
 * @see ChemistryRepeatTestDto
 */
@Slf4j
@RestController
@RequestMapping("/api/laboratory-reports/{reportId}/chemistry-repeat-tests")
@RequiredArgsConstructor
@Tag(name = "Chemistry Repeat Tests", description = "CRUD for chemistry repeat test results")
public class ChemistryRepeatTestController {

    private final ChemistryRepeatTestService service;

    @GetMapping
    @Operation(summary = "List all chemistry repeat tests for a laboratory report")
    public ResponseEntity<ApiResponse<List<ChemistryRepeatTestDto>>> listByReport(
            @PathVariable UUID reportId) {
        List<ChemistryRepeatTestDto> results = service.findByReportId(reportId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single chemistry repeat test by UUID")
    public ResponseEntity<ApiResponse<ChemistryRepeatTestDto>> getById(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        ChemistryRepeatTestDto dto = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new chemistry repeat test")
    public ResponseEntity<ApiResponse<ChemistryRepeatTestDto>> create(
            @PathVariable UUID reportId,
            @Valid @RequestBody ChemistryRepeatTestDto dto) {

        ChemistryRepeatTestDto created = service.create(reportId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Chemistry repeat test created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing chemistry repeat test")
    public ResponseEntity<ApiResponse<ChemistryRepeatTestDto>> update(
            @PathVariable UUID reportId,
            @PathVariable UUID id,
            @Valid @RequestBody ChemistryRepeatTestDto dto) {

        ChemistryRepeatTestDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Chemistry repeat test updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a chemistry repeat test")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID reportId,
            @PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Chemistry repeat test deleted successfully"));
    }
}
