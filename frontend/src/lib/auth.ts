/**
 * Frontend authentication helpers for the backend-driven Keycloak login.
 *
 * The Spring Boot backend is the OAuth2 client: it runs the Keycloak login and
 * holds the session. The browser only ever talks to the same-origin Next.js
 * proxy (`/api/backend/...`), so login and logout are full-page navigations to
 * the backend's OAuth endpoints *through the proxy*.
 *
 * These MUST be real browser navigations (not `fetch`), because the flow
 * involves top-level redirects to Keycloak's HTML login page and back.
 */

/** Proxy mount point — all backend traffic (incl. OAuth) flows through here. */
const PROXY_BASE = "/api/backend";

/** Spring's OAuth2 login entry point for the `keycloak` registration. */
export const LOGIN_URL = `${PROXY_BASE}/oauth2/authorization/keycloak`;

/** Spring's logout endpoint (POST by default; see startLogout). */
export const LOGOUT_URL = `${PROXY_BASE}/logout`;

/**
 * Redirects the whole page to Keycloak to sign in. On success the backend
 * redirects the browser back to the frontend.
 */
export function startLogin(): void {
  window.location.href = LOGIN_URL;
}

/**
 * Logs the user out.
 *
 * Spring's logout endpoint expects a POST. Since a plain link can't POST, we
 * submit a hidden form via a full-page navigation. The backend clears the
 * session and performs RP-initiated logout at Keycloak, then redirects back to
 * the frontend.
 */
export function startLogout(): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = LOGOUT_URL;
  document.body.appendChild(form);
  form.submit();
}
