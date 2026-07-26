package com.centerport.panama;

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
     *
     * @param pageable pagination and sorting parameters
     * @return paged list of Panama certificate DTOs
     */
    @GetMapping
    @Operation(summary = "List all Panama certificates with pagination",
               description = "Returns paginated Panama certificates. Default sort: createdDate DESC.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Certificates retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<PanamaCertificateDto>>> list(
            @ParameterObject
            @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<PanamaCertificateDto> page = service.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
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

        log.debug("Panama certificate creation requested — fullName: {}", dto.getFullName());
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
