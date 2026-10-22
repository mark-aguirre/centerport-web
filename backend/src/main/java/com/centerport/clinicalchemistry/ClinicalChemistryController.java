package com.centerport.clinicalchemistry;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

/**
 * REST controller for {@link ClinicalChemistry} CRUD operations.
 *
 * Exposes endpoints at {@code /api/clinical-chemistry} for listing/searching,
 * fetching, creating, updating, and deleting clinical-chemistry default value
 * sets. All responses are wrapped in {@link ApiResponse}.
 *
 * <p>Method-level guard mirrors the URL rule in {@code SecurityConfig}: only
 * Laboratory staff and administrators may manage these values.
 *
 * @see ClinicalChemistryService
 */
@RestController
@RequestMapping("/api/clinical-chemistry")
@RequiredArgsConstructor
@Tag(name = "Clinical Chemistry", description = "CRUD operations for clinical chemistry default/reference values")
@PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")
public class ClinicalChemistryController {

    private final ClinicalChemistryService service;

    @GetMapping
    @Operation(summary = "List clinical chemistry sets with pagination and optional search",
               description = "Returns paginated clinical chemistry sets. Optionally filter by name.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<ClinicalChemistryDto>>> list(
            @Parameter(description = "Search keyword — matches name (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 50, sort = "updatedDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<ClinicalChemistryDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a clinical chemistry set by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<ClinicalChemistryDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new clinical chemistry set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ClinicalChemistryDto>> create(@Valid @RequestBody ClinicalChemistryDto dto) {
        ClinicalChemistryDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Clinical chemistry values created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing clinical chemistry set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ClinicalChemistryDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ClinicalChemistryDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, dto), "Clinical chemistry values updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a clinical chemistry set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Clinical chemistry values deleted successfully"));
    }
}
