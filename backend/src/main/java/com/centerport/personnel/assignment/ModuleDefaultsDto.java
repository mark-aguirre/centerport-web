package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * The resolved default signatories for a single module, consumed by report
 * forms to pre-fill signatory fields on new records.
 *
 * <p>Only <b>active</b> personnel are returned. Each entry carries the role and
 * the current name/license/signature of the assigned person, so a form can map
 * a role to its field(s) without another lookup. A module with no active
 * assignment for a given role simply omits that entry, letting the client show
 * the "no active assignment" validation message.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleDefaultsDto {

    private PersonnelModule module;
    private List<Entry> entries;

    /** One resolved default: a role and the active person assigned to it. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Entry {
        private PersonnelRole role;
        private String personnelName;
        private String personnelLicenseNo;
        private String personnelTitle;
        private String signatureUrl;
    }
}
