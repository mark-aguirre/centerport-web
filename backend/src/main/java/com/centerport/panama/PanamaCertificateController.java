package com.centerport.panama;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import java.util.UUID;

/**
 * REST controller for Panama certificate CRUD operations.
 *
 * Exposes endpoints under {@code /api/panama-certificates} for listing,
 * fetching, creating, and updating Panama maritime medical certificates.
 *
 * @see PanamaCertificateService
 * @see PanamaCertificateDto
 */
@Slf4j
@RestController
@RequestMapping("/api/panama-certificates")
@RequiredArgsConstructor
@Tag(name = "Panama Certificates", description = "CRUD operations for Panama maritime medical certificates")
public class PanamaCertificateController {

    private final PanamaCertificateService service;

    /**
     * Returns paginated Panama certificates sorted by creation date descending.
     * Optionally filters by a search term matching the linked seafarer profile's
     * last name, first name, or the Panama ID.
     *
     * @param search   optional keyword to filter records (case-insensitive partial match)
     * @param pageable pagination and sorting parameters
     * @return paged list of Panama certificate DTOs
     */
    @GetMapping
    @Operation(summary = "List all Panama certificates with pagination and optional search",
               description = "Returns paginated Panama certificates. Optionally filter by seafarer name or Panama ID. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Certificates retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<PanamaCertificateDto>>> list(
            @Parameter(description = "Search keyword — matches seafarer last name, first name, or Panama ID (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<PanamaCertificateDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Retrieves all Panama certificates linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @return list of certificates for the given profile
     */
    @GetMapping("/by-profile/{profileId}")
    @Operation(summary = "List all Panama certificates for a specific seafarer profile",
               description = "Returns all Panama certificates linked to the given seafarer profile UUID, sorted by creation date descending.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Records retrieved")
    })
    public ResponseEntity<ApiResponse<java.util.List<PanamaCertificateDto>>> getByProfile(
            @PathVariable UUID profileId) {
        java.util.List<PanamaCertificateDto> records = service.findByProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    /**
     * Returns a single Panama certificate by its UUID.
     *
     * @param id the certificate's primary key
     * @return the matching Panama certificate DTO
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Panama certificate by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Certificate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Certificate not found")
    })
    public ResponseEntity<ApiResponse<PanamaCertificateDto>> getById(@PathVariable UUID id) {
        PanamaCertificateDto certificate = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(certificate));
    }

    /**
     * Creates a new Panama certificate.
     *
     * @param dto the certificate data to persist
     * @return the created certificate including server-generated system fields
     */
    @PostMapping
    @Operation(summary = "Create a new Panama certificate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Certificate created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<PanamaCertificateDto>> create(
            @Valid @RequestBody PanamaCertificateDto dto) {

        log.debug("Panama certificate creation requested — seafarerProfileId: {}", dto.getSeafarerProfileId());
        PanamaCertificateDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Panama certificate created successfully"));
    }

    /**
     * Updates an existing Panama certificate.
     *
     * @param id  the certificate's primary key
     * @param dto the updated certificate data
     * @return the updated Panama certificate DTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing Panama certificate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Certificate updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Certificate not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<PanamaCertificateDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody PanamaCertificateDto dto) {

        log.debug("Panama certificate update requested — id: {}", id);
        PanamaCertificateDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Panama certificate updated successfully"));
    }
}
