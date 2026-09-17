import type { PersonnelModuleCode, PersonnelRoleCode } from "@/lib/api";

/**
 * Shared vocabulary for medical-personnel roles, modules, and the
 * module -> assignable-roles matrix.
 *
 * This mirrors the backend {@code PersonnelRole} / {@code PersonnelModule}
 * enums and {@code PersonnelModule.allowedRoles()}. Keeping it in one place
 * means the Super Admin page and the report-form default wiring agree on the
 * same codes, labels, and constraints without duplicating literals.
 */

/** Human-readable label for each role code. */
export const ROLE_LABELS: Record<PersonnelRoleCode, string> = {
  MED_TECH: "Medical Technologist",
  PATHOLOGIST: "Pathologist",
  AUTHORIZED_PHYSICIAN: "Authorized Physician",
  MEDICAL_DIRECTOR: "Medical Director",
  PSYCHOMETRICIAN: "Psychometrician",
  PSYCHOLOGIST: "Psychologist",
};

/** Human-readable label for each module code. */
export const MODULE_LABELS: Record<PersonnelModuleCode, string> = {
  LABORATORY: "Laboratory",
  SEABASE: "Seabase",
  MLC: "MLC",
  LANDBASE: "Landbase",
  PSYCHOLOGY: "Psychology",
};

/** All role codes, in display order. */
export const ALL_ROLES: PersonnelRoleCode[] = [
  "MED_TECH",
  "PATHOLOGIST",
  "AUTHORIZED_PHYSICIAN",
  "MEDICAL_DIRECTOR",
  "PSYCHOMETRICIAN",
  "PSYCHOLOGIST",
];

/** All module codes, in display order. */
export const ALL_MODULES: PersonnelModuleCode[] = [
  "LABORATORY",
  "SEABASE",
  "MLC",
  "LANDBASE",
  "PSYCHOLOGY",
];

/**
 * Roles assignable to each module. Mirrors the backend assignment matrix.
 * The Super Admin page uses this to constrain the personnel picker per row,
 * satisfying "each module can only select personnel assigned to its allowed
 * roles."
 */
export const MODULE_ROLES: Record<PersonnelModuleCode, PersonnelRoleCode[]> = {
  LABORATORY: ["MED_TECH", "PATHOLOGIST"],
  SEABASE: ["AUTHORIZED_PHYSICIAN", "MEDICAL_DIRECTOR"],
  MLC: ["AUTHORIZED_PHYSICIAN", "MEDICAL_DIRECTOR"],
  LANDBASE: ["AUTHORIZED_PHYSICIAN", "MEDICAL_DIRECTOR"],
  PSYCHOLOGY: ["PSYCHOMETRICIAN", "PSYCHOLOGIST"],
};

/** Convenience: label a role code, falling back to the raw code. */
export function roleLabel(role?: PersonnelRoleCode | null): string {
  return role ? (ROLE_LABELS[role] ?? role) : "—";
}

/** Convenience: label a module code, falling back to the raw code. */
export function moduleLabel(module: PersonnelModuleCode): string {
  return MODULE_LABELS[module] ?? module;
}
