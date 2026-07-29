package com.centerport.visit;

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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.UUID;

/**
 * REST controller for PatientVisit CRUD operations.
 *
 * Exposes endpoints at {@code /api/visits} for listing today's visits,
 * creating new visits, fetching a single visit, and deleting visits.
 *
 * @see PatientVisitService
 */
@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
@Tag(name = "Patient Visits", description = "Track daily patient clinic visits")
public class PatientVisitController {

    private final PatientVisitService service;

    /**
     * List visits for a specific date (defaults to today).
     *
     * @param date     the date to query (ISO format, defaults to today)
     * @param pageable pagination and sorting parameters
     * @return paged list of visit records with joined profile data
     */
    @GetMapping
    @Operation(summary = "List visits by date",
               description = "Returns paginated patient visits for the given date (defaults to today). Includes joined profile display fields.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Visits retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<PatientVisitDto>>> list(
            @Parameter(description = "Visit date (ISO format, e.g. 2026-07-29). Defaults to today.")
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,
            @ParameterObject
            @PageableDefault(size = 100, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        LocalDate queryDate = date != null ? date : LocalDate.now();
        PagedResponse<PatientVisitDto> page = service.findByDate(queryDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Get a single visit by UUID.
     *
     * @param id the visit UUID
     * @return the visit record with profile data
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get visit by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Visit found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Visit not found")
    })
    public ResponseEntity<ApiResponse<PatientVisitDto>> getById(@PathVariable UUID id) {
        PatientVisitDto visit = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(visit));
    }

    /**
     * Create a new patient visit.
     *
     * Requires a valid {@code seafarerProfileId}. The visit date defaults
     * to today if not provided. A business ID (VST prefix) is generated server-side.
     *
     * @param dto the visit data
     * @return the persisted visit with generated fields
     */
    @PostMapping
    @Operation(summary = "Create a new patient visit")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Visit created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Referenced profile not found")
    })
    public ResponseEntity<ApiResponse<PatientVisitDto>> create(@Valid @RequestBody PatientVisitDto dto) {
        PatientVisitDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Visit created successfully"));
    }

    /**
     * Delete a visit record.
     *
     * @param id the visit UUID
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a visit")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Visit deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Visit not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Visit deleted successfully"));
    }
}
