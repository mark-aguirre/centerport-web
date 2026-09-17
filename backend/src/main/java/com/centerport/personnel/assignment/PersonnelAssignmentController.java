package com.centerport.personnel.assignment;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for module/role personnel assignments.
 *
 * <p>Endpoints under {@code /api/personnel-assignments} let administrators
 * configure the default signatory for each module/role and inspect the change
 * history. The {@code /defaults} endpoint is consumed by report forms to
 * pre-fill signatory fields and is intentionally readable by any authenticated
 * user (see {@code SecurityConfig}); all other operations are ADMIN-only.
 *
 * @see PersonnelAssignmentService
 */
@RestController
@RequestMapping("/api/personnel-assignments")
@RequiredArgsConstructor
@Tag(name = "Personnel Assignments",
        description = "Configure and resolve default signatories per module/role")
public class PersonnelAssignmentController {

    private final PersonnelAssignmentService service;

    /** Lists every configured assignment (ADMIN). */
    @GetMapping
    @Operation(summary = "List all personnel assignments")
    public ResponseEntity<ApiResponse<List<PersonnelAssignmentDto>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    /** Lists the assignments configured for a single module (ADMIN). */
    @GetMapping("/module/{module}")
    @Operation(summary = "List assignments for a module")
    public ResponseEntity<ApiResponse<List<PersonnelAssignmentDto>>> byModule(
            @PathVariable PersonnelModule module) {
        return ResponseEntity.ok(ApiResponse.success(service.findByModule(module)));
    }

    /**
     * Resolves the active default signatories for a module — consumed by report
     * forms to pre-fill signatory fields on new records.
     */
    @GetMapping("/defaults/{module}")
    @Operation(summary = "Resolve active default signatories for a module",
            description = "Returns the active assigned personnel for each role in the module. "
                    + "Used by report forms to pre-fill signatory fields on new records.")
    public ResponseEntity<ApiResponse<ModuleDefaultsDto>> defaults(
            @PathVariable PersonnelModule module) {
        return ResponseEntity.ok(ApiResponse.success(service.resolveDefaults(module)));
    }

    /**
     * Creates or repoints the assignment for a (module, role) pair (ADMIN).
     * Upsert semantics: an existing assignment for the pair is updated in place.
     */
    @PutMapping
    @Operation(summary = "Create or update a module/role assignment")
    public ResponseEntity<ApiResponse<PersonnelAssignmentDto>> assign(
            @Valid @RequestBody PersonnelAssignmentDto dto) {
        PersonnelAssignmentDto saved = service.assign(dto);
        return ResponseEntity.ok(ApiResponse.success(saved, "Assignment saved"));
    }

    /** Removes an assignment so the module/role reverts to no default (ADMIN). */
    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a module/role assignment")
    public ResponseEntity<Void> remove(@PathVariable UUID id) {
        service.remove(id);
        return ResponseEntity.noContent().build();
    }

    /** Paginated assignment-change history for a module (ADMIN). */
    @GetMapping("/audit/{module}")
    @Operation(summary = "Assignment change history for a module")
    public ResponseEntity<ApiResponse<PagedResponse<PersonnelAssignmentAuditDto>>> audit(
            @PathVariable PersonnelModule module,
            @Parameter(description = "Pagination — default 20 per page, most recent first")
            @ParameterObject
            @PageableDefault(size = 20, sort = "changedAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        Page<PersonnelAssignmentAuditDto> page = service.auditHistory(module, pageable);
        PagedResponse<PersonnelAssignmentAuditDto> body =
                PagedResponse.of(page.getContent(), page);
        return ResponseEntity.ok(ApiResponse.success(body));
    }
}
