package com.centerport.personnel.assignment;

import com.centerport.common.exception.BadRequestException;
import com.centerport.common.exception.NotFoundException;
import com.centerport.config.security.CurrentUserProvider;
import com.centerport.personnel.MedicalPersonnel;
import com.centerport.personnel.MedicalPersonnelRepository;
import com.centerport.personnel.PersonnelRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Business logic for module/role personnel assignments.
 *
 * <p>Enforces the assignment matrix (a role must be allowed for its module, and
 * the assigned person must actually hold that role), applies upsert semantics
 * on the unique (module, role) key, records every change in the append-only
 * {@link PersonnelAssignmentAudit} log, and resolves the active default
 * signatories that report forms pre-fill.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PersonnelAssignmentService {

    private final PersonnelAssignmentRepository repository;
    private final PersonnelAssignmentAuditRepository auditRepository;
    private final MedicalPersonnelRepository personnelRepository;
    private final PersonnelAssignmentMapper mapper;
    private final CurrentUserProvider currentUserProvider;

    // === Queries ===

    /** Returns every assignment, ordered by module then role for stable display. */
    public List<PersonnelAssignmentDto> findAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> {
                    int m = a.getModule().compareTo(b.getModule());
                    return m != 0 ? m : a.getRole().compareTo(b.getRole());
                })
                .map(mapper::toDto)
                .toList();
    }

    /** Returns the assignments configured for a single module. */
    public List<PersonnelAssignmentDto> findByModule(PersonnelModule module) {
        return repository.findByModule(module).stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Resolves the active default signatories for a module.
     *
     * <p>Only assignments whose personnel are currently active are returned;
     * an inactive assigned person is treated as "no default" so forms surface
     * the missing-assignment message rather than silently defaulting to someone
     * who has been deactivated.
     *
     * @param module the module to resolve defaults for
     * @return the resolved defaults (entries may be empty)
     */
    public ModuleDefaultsDto resolveDefaults(PersonnelModule module) {
        List<ModuleDefaultsDto.Entry> entries = new ArrayList<>();
        for (PersonnelAssignment assignment : repository.findByModule(module)) {
            MedicalPersonnel person = assignment.getPersonnel();
            if (person == null || !Boolean.TRUE.equals(person.getActive())) {
                continue;
            }
            entries.add(ModuleDefaultsDto.Entry.builder()
                    .role(assignment.getRole())
                    .personnelName(person.getName())
                    .personnelLicenseNo(person.getLicenseNo())
                    .personnelTitle(person.getTitle())
                    .signatureUrl(person.getSignatureUrl())
                    .build());
        }
        return ModuleDefaultsDto.builder()
                .module(module)
                .entries(entries)
                .build();
    }

    /** Paginated audit history for a module (most recent first). */
    public Page<PersonnelAssignmentAuditDto> auditHistory(PersonnelModule module, Pageable pageable) {
        return auditRepository.findByModuleOrderByChangedAtDesc(module, pageable)
                .map(mapper::toAuditDto);
    }

    // === Commands ===

    /**
     * Creates or repoints the assignment for a (module, role) pair.
     *
     * <p>Validation:
     * <ul>
     *   <li>the role must be allowed for the module (per the assignment matrix);</li>
     *   <li>the target personnel must exist, be active, and hold the same role.</li>
     * </ul>
     * When an assignment already exists for the pair it is updated in place;
     * otherwise a new one is created. Either way an audit row is written.
     *
     * @param dto the desired assignment (module, role, personnelId)
     * @return the persisted assignment DTO with the resolved personnel snapshot
     */
    @Transactional
    public PersonnelAssignmentDto assign(PersonnelAssignmentDto dto) {
        PersonnelModule module = dto.getModule();
        PersonnelRole role = dto.getRole();

        if (!module.allows(role)) {
            throw new BadRequestException(
                    "Role " + role + " cannot be assigned to module " + module
                            + ". Allowed roles: " + module.allowedRoles());
        }

        MedicalPersonnel person = personnelRepository.findById(dto.getPersonnelId())
                .orElseThrow(() -> new NotFoundException("MedicalPersonnel", dto.getPersonnelId()));

        if (!Boolean.TRUE.equals(person.getActive())) {
            throw new BadRequestException("Cannot assign an inactive personnel record.");
        }
        if (person.getRole() != role) {
            throw new BadRequestException(
                    "Personnel '" + person.getName() + "' has role " + person.getRole()
                            + " but the assignment requires " + role + ".");
        }

        Optional<PersonnelAssignment> existingOpt = repository.findByModuleAndRole(module, role);
        String actor = currentUserProvider.currentUsername();

        PersonnelAssignment assignment;
        PersonnelAssignmentAudit.PersonnelAssignmentAuditAction action;
        UUID previousId = null;
        String previousName = null;

        if (existingOpt.isPresent()) {
            assignment = existingOpt.get();
            MedicalPersonnel prev = assignment.getPersonnel();
            if (prev != null) {
                previousId = prev.getId();
                previousName = prev.getName();
            }
            // No-op guard: reassigning to the same person still returns success
            // but writes no audit row (nothing changed).
            boolean unchanged = prev != null && prev.getId().equals(person.getId());
            assignment.setPersonnel(person);
            assignment.setUpdatedBy(actor);
            action = PersonnelAssignmentAudit.PersonnelAssignmentAuditAction.UPDATED;
            PersonnelAssignment saved = repository.save(assignment);
            if (!unchanged) {
                writeAudit(module, role, action, previousId, previousName, person, actor);
            }
            log.info("Assignment updated — module: {}, role: {}, personnel: {}, by: {}",
                    module, role, person.getName(), actor);
            return mapper.toDto(saved);
        }

        assignment = new PersonnelAssignment();
        assignment.setModule(module);
        assignment.setRole(role);
        assignment.setPersonnel(person);
        assignment.setCreatedBy(actor);
        assignment.setUpdatedBy(actor);
        action = PersonnelAssignmentAudit.PersonnelAssignmentAuditAction.CREATED;
        PersonnelAssignment saved = repository.save(assignment);
        writeAudit(module, role, action, previousId, previousName, person, actor);
        log.info("Assignment created — module: {}, role: {}, personnel: {}, by: {}",
                module, role, person.getName(), actor);
        return mapper.toDto(saved);
    }

    /**
     * Removes an assignment entirely (a module/role reverts to having no
     * default). The removal is recorded in the audit log.
     *
     * @param id the assignment UUID
     * @throws NotFoundException if no assignment exists with the given ID
     */
    @Transactional
    public void remove(UUID id) {
        PersonnelAssignment assignment = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("PersonnelAssignment", id));
        MedicalPersonnel prev = assignment.getPersonnel();
        String actor = currentUserProvider.currentUsername();

        repository.delete(assignment);

        // Record the removal as an UPDATE to "none" for a complete history.
        PersonnelAssignmentAudit audit = new PersonnelAssignmentAudit();
        audit.setModule(assignment.getModule());
        audit.setRole(assignment.getRole());
        audit.setAction(PersonnelAssignmentAudit.PersonnelAssignmentAuditAction.UPDATED);
        if (prev != null) {
            audit.setPreviousPersonnelId(prev.getId());
            audit.setPreviousPersonnelName(prev.getName());
            audit.setNewPersonnelId(prev.getId());
            audit.setNewPersonnelName("(removed)");
        }
        audit.setChangedBy(actor);
        audit.setChangedAt(LocalDateTime.now());
        auditRepository.save(audit);

        log.info("Assignment removed — module: {}, role: {}, by: {}",
                assignment.getModule(), assignment.getRole(), actor);
    }

    // === Helpers ===

    private void writeAudit(PersonnelModule module,
                            PersonnelRole role,
                            PersonnelAssignmentAudit.PersonnelAssignmentAuditAction action,
                            UUID previousId,
                            String previousName,
                            MedicalPersonnel person,
                            String actor) {
        PersonnelAssignmentAudit audit = new PersonnelAssignmentAudit();
        audit.setModule(module);
        audit.setRole(role);
        audit.setAction(action);
        audit.setPreviousPersonnelId(previousId);
        audit.setPreviousPersonnelName(previousName);
        audit.setNewPersonnelId(person.getId());
        audit.setNewPersonnelName(person.getName());
        audit.setChangedBy(actor);
        audit.setChangedAt(LocalDateTime.now());
        auditRepository.save(audit);
    }
}
