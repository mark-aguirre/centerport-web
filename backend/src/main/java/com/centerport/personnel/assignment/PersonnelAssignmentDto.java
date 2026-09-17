package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for a {@link PersonnelAssignment}.
 *
 * <p>On input (create/update) only {@code module}, {@code role}, and
 * {@code personnelId} are required. On output the resolved personnel snapshot
 * ({@code personnelName}, {@code personnelLicenseNo}, {@code signatureUrl}) and
 * audit fields are populated for display.
 *
 * <p>All fields serialize to snake_case via the global Jackson config.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelAssignmentDto {

    private UUID id;

    @NotNull(message = "module is required")
    private PersonnelModule module;

    @NotNull(message = "role is required")
    private PersonnelRole role;

    /** The assigned personnel's UUID (required on input). */
    @NotNull(message = "personnel_id is required")
    private UUID personnelId;

    // --- Resolved snapshot (output only) ---
    private String personnelBusinessId;
    private String personnelName;
    private String personnelLicenseNo;
    private String personnelTitle;
    private String signatureUrl;
    private Boolean personnelActive;

    // --- Audit (output only) ---
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
