package com.centerport.psychology;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
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
 * REST controller for PsychologyEvaluation CRUD operations.
 *
 * Exposes endpoints under {@code /api/psychology-evaluations} for listing,
 * fetching, creating, and updating psychological evaluation records.
 *
 * @see PsychologyEvaluationService
 * @see PsychologyEvaluationDto
 */
@Slf4j
@RestController
@RequestMapping("/api/psychology-evaluations")
@RequiredArgsConstructor
@Tag(name = "Psychology Evaluations", description = "CRUD operations for psychological evaluation records")
public class PsychologyEvaluationController {

    private final PsychologyEvaluationService service;

    /**
     * Returns paginated psychology evaluations sorted by creation date descending.
     *
     * @param pageable pagination and sorting parameters
     * @return paged list of evaluation DTOs
     */
    @GetMapping
    @Operation(summary = "List all psychology evaluations with pagination",
               description = "Returns paginated evaluations. Supports optional search by patient name or eval ID. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Evaluations retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<PsychologyEvaluationDto>>> list(
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<PsychologyEvaluationDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Retrieves all psychology evaluations linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @return list of evaluation records for the given profile
     */
    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all psychology evaluations for a specific seafarer profile",
               description = "Returns all evaluation records linked to the given seafarer profile UUID, sorted by creation date descending.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<List<PsychologyEvaluationDto>>> getByProfile(
            @PathVariable UUID profileId) {
        List<PsychologyEvaluationDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    /**
     * Returns a single psychology evaluation by its UUID.
     *
     * @param id the evaluation's primary key
     * @return the matching evaluation DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get psychology evaluation by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Evaluation found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Evaluation not found")
    })
    public ResponseEntity<ApiResponse<PsychologyEvaluationDto>> getById(@PathVariable UUID id) {
        PsychologyEvaluationDto evaluation = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(evaluation));
    }

    /**
     * Creates a new psychology evaluation record.
     *
     * Client-supplied system fields (id, evalId, createdDate, updatedDate) are
     * ignored. A business ID with prefix PSYCH is generated server-side.
     *
     * @param dto the evaluation data to persist
     * @return the created evaluation including server-generated system fields
     */
    @PostMapping
    @Operation(summary = "Create a new psychology evaluation record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Evaluation created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<PsychologyEvaluationDto>> create(@Valid @RequestBody PsychologyEvaluationDto dto) {
        log.debug("Psychology evaluation creation requested — seafarerProfileId: {}", dto.getSeafarerProfileId());
        PsychologyEvaluationDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Psychology evaluation created successfully"));
    }

    /**
     * Updates an existing psychology evaluation record.
     *
     * System fields (id, evalId, createdDate) are preserved from the existing
     * entity. {@code updatedDate} is refreshed automatically.
     *
     * @param id  the evaluation's primary key
     * @param dto the updated evaluation data
     * @return the updated evaluation DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing psychology evaluation record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Evaluation updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Evaluation not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<PsychologyEvaluationDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody PsychologyEvaluationDto dto) {

        log.debug("Psychology evaluation update requested — id: {}", id);
        PsychologyEvaluationDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Psychology evaluation updated successfully"));
    }
}
