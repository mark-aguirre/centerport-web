package com.centerport.defaultvalues;

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
 * REST controller for {@link DefaultValues} CRUD operations.
 *
 * Exposes endpoints at {@code /api/default-values} for listing/searching,
 * fetching, creating, updating, and deleting laboratory hematology default
 * value sets. All responses are wrapped in {@link ApiResponse}.
 *
 * <p>Method-level guard mirrors the URL rule in {@code SecurityConfig}: only
 * Laboratory staff and administrators may manage default values.
 *
 * @see DefaultValuesService
 */
@RestController
@RequestMapping("/api/default-values")
@RequiredArgsConstructor
@Tag(name = "Default Values", description = "CRUD operations for laboratory hematology default/reference values")
@PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")
public class DefaultValuesController {

    private final DefaultValuesService service;

    @GetMapping
    @Operation(summary = "List default value sets with pagination and optional search",
               description = "Returns paginated default value sets. Optionally filter by name.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<DefaultValuesDto>>> list(
            @Parameter(description = "Search keyword — matches name (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 50, sort = "updatedDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<DefaultValuesDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a default value set by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<DefaultValuesDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new default value set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Record created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<DefaultValuesDto>> create(@Valid @RequestBody DefaultValuesDto dto) {
        DefaultValuesDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Default values created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing default value set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<DefaultValuesDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DefaultValuesDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, dto), "Default values updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a default value set")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Record deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Record not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Default values deleted successfully"));
    }
}
