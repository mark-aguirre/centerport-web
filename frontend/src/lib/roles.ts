/**
 * Application roles and the module → role access map.
 *
 * This MIRRORS the authoritative rules enforced by the Spring Boot backend
 * (see backend/documentation/keycloak-security.md). The frontend uses this only
 * for UX — hiding nav items and guarding routes the user cannot use. The
 * backend still returns 403 if a user calls a forbidden endpoint, so these
 * checks can never be relied on for security.
 */

/** Keycloak realm roles (bare names, matching `realm_access.roles`). */
export type Role =
  | "ADMIN"
  | "INFORMATION"
  | "PSYCHOLOGY"
  | "LABORATORY"
  | "RELEASING"
  | "ACCOUNTING";

/**
 * Maps a top-level route (by its `href` in navigation.ts) to the roles that may
 * access it. `ADMIN` is added to every entry automatically by
 * {@link canAccessRoute}, so it is omitted here.
 */
const ROUTE_ROLES: Record<string, Role[]> = {
  "/dashboard": ["INFORMATION", "PSYCHOLOGY", "LABORATORY", "RELEASING"],
  "/visit": ["INFORMATION"],
  "/profile": ["INFORMATION", "RELEASING"],
  "/seabase": ["RELEASING"],
  "/laboratory": ["LABORATORY"],
  "/mlc": ["RELEASING"],
  "/panama": ["RELEASING"],
  "/landbase": ["RELEASING"],
  "/psychology": ["PSYCHOLOGY"],
  "/accounting": ["ACCOUNTING"],
  // Super Admin only: an empty required-role list means no non-ADMIN role
  // grants access, so only the ADMIN short-circuit in canAccessRoute passes.
  "/medical-personnel": [],
};

/** True if any of the user's roles grant access to the given route href. */
export function canAccessRoute(href: string, roles: readonly string[]): boolean {
  if (roles.includes("ADMIN")) {
    return true;
  }
  // Match the longest known route prefix (e.g. /profile/123 → /profile).
  const key = Object.keys(ROUTE_ROLES)
    .filter((route) => href === route || href.startsWith(route + "/"))
    .sort((a, b) => b.length - a.length)[0];

  if (!key) {
    // Unlisted routes are visible to any authenticated user.
    return true;
  }
  return ROUTE_ROLES[key].some((role) => roles.includes(role));
}

/** True if the user holds at least one of the required roles (ADMIN always passes). */
export function hasAnyRole(
  roles: readonly string[],
  required: readonly Role[]
): boolean {
  if (roles.includes("ADMIN")) {
    return true;
  }
  return required.some((role) => roles.includes(role));
}
