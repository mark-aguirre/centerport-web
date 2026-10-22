package com.centerport.tumorimmunology;

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
 * REST controller for {@link TumorImmunology} CRUD operations.
 *
 * Exposes endpoints at {@code /api/tumor-immunology} for listing/searching,
 * fetching, creating, updating, and deleting tumor/immunological default value
 * sets. All responses are wrapped in {@link ApiResponse}.
 *
 * <p>Method-level guard mirrors the URL rule in {@code SecurityConfig}: only
 * Laboratory staff and administrators may manage these values.
 *
 * @see TumorImmunologyService
 */
@RestController
@RequestMapping("/api/tumor-immunology")
@RequiredArgsConstructor
@Tag(name = "Tumor / Immunology", description = "CRUD operations for tumor/immunological default/reference values")
@PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")
public class TumorImmunologyController {

    private final TumorImmunologyService service;

    @GetMapping
    @Operation(summary = "List tumor/immunology sets with pagination and optional search",
               description = "Returns paginated tumor/immunology sets. Optionally filter by name.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<TumorImmunologyDto>>> list(
            @Parameter(description = "Search keyword — matches name (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 50, sort = "updatedDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<TumorImmunologyDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a tumor/immunology set by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<TumorImmunologyDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new tumor/immunology set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<TumorImmunologyDto>> create(@Valid @RequestBody TumorImmunologyDto dto) {
        TumorImmunologyDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Tumor/immunology values created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing tumor/immunology set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<TumorImmunologyDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody TumorImmunologyDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, dto), "Tumor/immunology values updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tumor/immunology set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tumor/immunology values deleted successfully"));
    }
}
