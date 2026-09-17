package com.centerport.personnel;

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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for MedicalPersonnel CRUD operations.
 *
 * Exposes endpoints at {@code /api/medical-personnel} for listing, searching,
 * fetching, creating, and updating medical personnel records.
 *
 * @see MedicalPersonnelService
 */
@RestController
@RequestMapping("/api/medical-personnel")
@RequiredArgsConstructor
@Tag(name = "Medical Personnel", description = "CRUD operations for medical personnel (doctors, psychologists, psychometricians)")
public class MedicalPersonnelController {

    private final MedicalPersonnelService service;

    /**
     * Returns paginated personnel sorted by name ascending.
     * Optionally filters by a search term matching name, license number, or specialization.
     *
     * @param search   optional keyword to filter personnel (case-insensitive partial match)
     * @param pageable pagination and sorting parameters
     * @return paged list of personnel
     */
    @GetMapping
    @Operation(summary = "List medical personnel for administration (paginated, filterable)",
               description = "Returns paginated personnel including inactive ones. Optionally filter by "
                       + "search keyword, active status, and role. ADMIN only. Default sort: name ASC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Personnel retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<MedicalPersonnelDto>>> list(
            @Parameter(description = "Search keyword — matches name, license number, or specialization (case-insensitive)")
            @RequestParam(required = false) String search,
            @Parameter(description = "Filter by active status. Omit to include both active and inactive.")
            @RequestParam(required = false) Boolean active,
            @Parameter(description = "Filter by role (e.g. MED_TECH, PATHOLOGIST). Omit for all roles.")
            @RequestParam(required = false) PersonnelRole role,
            @ParameterObject
            @PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC)
            Pageable pageable) {

        PagedResponse<MedicalPersonnelDto> page = service.findAllForAdmin(search, active, role, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns all active personnel matching the search keyword (unpaginated).
     * Designed for the medical personnel selection dialog which needs a quick
     * searchable list without pagination complexity.
     *
     * @param keyword optional search term
     * @return list of matching active personnel
     */
    @GetMapping("/search")
    @Operation(summary = "Search medical personnel (unpaginated)",
               description = "Returns all active personnel matching the keyword. Used by the personnel selection dialog.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search results")
    })
    public ResponseEntity<ApiResponse<List<MedicalPersonnelDto>>> search(
            @Parameter(description = "Search keyword — matches name, license number, or specialization")
            @RequestParam(required = false) String keyword) {

        List<MedicalPersonnelDto> results = service.search(keyword);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /**
     * Returns a single personnel record by UUID.
     *
     * @param id the personnel UUID
     * @return the matching personnel
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get medical personnel by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Personnel found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Personnel not found")
    })
    public ResponseEntity<ApiResponse<MedicalPersonnelDto>> getById(@PathVariable UUID id) {
        MedicalPersonnelDto personnel = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(personnel));
    }

    /**
     * Creates a new medical personnel record.
     * Returns 201 with the created record including server-generated system fields.
     *
     * @param dto the personnel data
     * @return the persisted personnel DTO
     */
    @PostMapping
    @Operation(summary = "Create a new medical personnel record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Personnel created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MedicalPersonnelDto>> create(@Valid @RequestBody MedicalPersonnelDto dto) {
        MedicalPersonnelDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Medical personnel created successfully"));
    }

    /**
     * Updates an existing medical personnel record.
     * Returns 200 with the updated record.
     *
     * @param id  the personnel UUID
     * @param dto the updated personnel data
     * @return the updated personnel DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing medical personnel record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Personnel updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Personnel not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<MedicalPersonnelDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody MedicalPersonnelDto dto) {

        MedicalPersonnelDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medical personnel updated successfully"));
    }

    /**
     * Deactivates (soft-deletes) a personnel record so it is excluded from
     * future selection while historical report signatures are preserved.
     *
     * @param id the personnel UUID
     * @return the updated (inactive) personnel DTO
     */
    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a medical personnel record (soft delete)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Personnel deactivated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Personnel not found")
    })
    public ResponseEntity<ApiResponse<MedicalPersonnelDto>> deactivate(@PathVariable UUID id) {
        MedicalPersonnelDto updated = service.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medical personnel deactivated"));
    }

    /**
     * Reactivates a previously deactivated personnel record.
     *
     * @param id the personnel UUID
     * @return the updated (active) personnel DTO
     */
    @PostMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate a medical personnel record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Personnel reactivated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Personnel not found")
    })
    public ResponseEntity<ApiResponse<MedicalPersonnelDto>> reactivate(@PathVariable UUID id) {
        MedicalPersonnelDto updated = service.reactivate(id);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medical personnel reactivated"));
    }

    /**
     * Hard-deletes a personnel record. Rejected with 409 when the record is
     * referenced by any existing report/certificate — deactivate instead.
     *
     * @param id the personnel UUID
     * @return 204 No Content on success
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a medical personnel record (blocked if referenced)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Personnel deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Personnel not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Personnel referenced by existing reports")
    })
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
