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
  // Accounting now lives entirely in the /sale POS workspace (billing endpoints
  // /api/receivables, /api/items, /api/customers, /api/products are restricted
  // to ADMIN + ACCOUNTING by the backend). There are no standalone accounting
  // routes to gate here anymore.
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

/**
 * The route a user should land on after login.
 *
 * Everyone is sent to `/dashboard` by default (see `app/page.tsx`), but some
 * roles cannot access it — the backend restricts `/api/dashboard/**` to
 * ADMIN, INFORMATION, PSYCHOLOGY, LABORATORY and RELEASING, so a dashboard
 * landing for anyone else (currently ACCOUNTING) only produces 403s. Those
 * users are routed to their primary workspace instead.
 *
 * ADMIN always keeps the dashboard because ADMIN can access every route. The
 * check is expressed in terms of `canAccessRoute` so it stays in lockstep with
 * the module access map above.
 */
export function landingRoute(roles: readonly string[]): string {
  if (canAccessRoute("/dashboard", roles)) {
    return "/dashboard";
  }
  // ACCOUNTING (and any future non-dashboard role) starts in the POS/sale
  // workspace, which is open to any authenticated user.
  return "/sale";
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
