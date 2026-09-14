# Keycloak Authentication — Frontend (backend-driven)

The frontend does **no** OAuth. The Spring Boot backend is the OAuth2 client:
it runs the Keycloak login and holds the session. The frontend just:

1. Redirects the user to the backend login when there is no session.
2. Reads the signed-in user and roles from `GET /api/me`.
3. Gates navigation/UI by role (UX only — the backend enforces access).
4. Offers sign-out (which triggers the backend + Keycloak logout).

Full flow and Keycloak setup: `backend/documentation/keycloak-security.md`.

---

## How it works

Everything goes through the same-origin proxy (`/api/backend/...`). Login and
logout are **full-page navigations** (not `fetch`), because they involve
top-level redirects to Keycloak.

```
No session → GET /api/me returns 401 → AuthProvider calls startLogin()
  → full-page nav to /api/backend/oauth2/authorization/keycloak
  → backend → Keycloak login → back through the proxy → session cookie set
  → app reloads authenticated
```

The proxy (`src/app/api/backend/[...path]/route.ts`) relays the backend's
`Set-Cookie` (session cookie), re-scoping its `Path` to `/api/backend`, so the
browser sends it back on every backend call.

---

## The pieces

| File | Role |
| --- | --- |
| `src/lib/auth.ts` | `LOGIN_URL`, `startLogin()`, `startLogout()` (full-page navs). |
| `src/lib/roles.ts` | Module → role map (mirrors the backend) for UX gating. |
| `src/components/auth-provider.tsx` | Loads `/api/me`; redirects to login on 401; exposes `user`, `roles`, `can`, `canRoute`. |
| `src/components/auth-gate.tsx` | Splash while the session resolves. |
| `src/components/layout/user-menu.tsx` | Avatar menu: name, roles, sign out. |
| `src/app/(app)/layout.tsx` | Wraps the app in `AuthProvider` + `AuthGate`. |
| `src/lib/api.ts` | `api.auth.me()` → `GET /api/me`. |

Sidebar (`app-sidebar.tsx`) and mobile nav (`mobile-nav.tsx`) filter entries via
`useAuth().canRoute(href)`.

---

## Using auth in components

```tsx
"use client";
import { useAuth } from "@/components/auth-provider";

function Example() {
  const { user, roles, can } = useAuth();

  if (can(["LABORATORY"])) {
    // ADMIN always passes too.
  }
  return <span>{user?.full_name}</span>;
}
```

Gate an action by role:

```tsx
const { can } = useAuth();
{can(["ADMIN"]) && <DeleteButton />}
```

> These checks only hide UI. The backend returns 403 if a user calls a
> forbidden endpoint, so security does not depend on the frontend.

---

## Environment

No auth secrets live in the frontend anymore. The only backend-related var is
the existing server-only proxy target:

```dotenv
BACKEND_API_URL=http://127.0.0.1:8080
```

The Keycloak client id/secret live in `backend/.env`, not here.

---

## Notes / gotchas

- **Dev over HTTP:** the backend session cookie must not be `Secure` in dev
  (backend default `SESSION_COOKIE_SECURE=false`), or the browser drops it.
- **Login must be a full navigation.** Never call the login URL with `fetch` —
  it can't follow the redirect to Keycloak's HTML page. Use `startLogin()`.
- **Logout is a POST.** `startLogout()` submits a hidden form to
  `/api/backend/logout` (Spring's logout endpoint expects POST).
- **Route changes:** if you add a new top-level route, add it to
  `src/lib/roles.ts` (`ROUTE_ROLES`) and the backend URL rules so gating and
  enforcement stay in sync.
