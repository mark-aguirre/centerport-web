package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Read-only view of a {@link PersonnelAssignmentAudit} row for the admin
 * assignment-history panel.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelAssignmentAuditDto {

    private UUID id;
    private PersonnelModule module;
    private PersonnelRole role;
    private PersonnelAssignmentAudit.PersonnelAssignmentAuditAction action;
    private UUID previousPersonnelId;
    private String previousPersonnelName;
    private UUID newPersonnelId;
    private String newPersonnelName;
    private String changedBy;
    private LocalDateTime changedAt;
}
