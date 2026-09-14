# Keycloak Security — Backend-Driven Login (OAuth2 Client)

The CenterPort **backend** is the OAuth2 / OpenID Connect **client**. It runs the
Keycloak login flow itself and keeps users authenticated with a server-side
session. Tokens never reach the browser. The Next.js frontend has no OAuth code;
it relies on the session and reads the user from `GET /api/me`.

- Spring Boot: **3.4.1**, Spring Security **6.x**, Java **21**
- Keycloak realm: `centerport-realm` at `http://192.168.0.15:8086`
- Issuer URI: `http://192.168.0.15:8086/realms/centerport-realm`

---

## 1. The flow

```
Browser ──(1) full-page nav──> /api/backend/oauth2/authorization/keycloak
Next proxy ─────────────────> backend /oauth2/authorization/keycloak
backend ──(2) 302───────────> Keycloak login page
Browser ──(3) login──────────> Keycloak
Keycloak ─(4) 302 w/ code────> /api/backend/login/oauth2/code/keycloak
Next proxy ─────────────────> backend /login/oauth2/code/keycloak
backend ──(5) code→token (server-to-server, confidential secret) ──> Keycloak
backend ──(6) sets JSESSIONID session cookie, 302 ──> frontend (http://localhost:3000)
Browser ──(7) /api/backend/api/... with session cookie ──> backend (authorized)
```

Everything the browser sees is the frontend origin (`http://localhost:3000`); it
never contacts the backend or Keycloak token endpoint directly. The proxy
(`frontend/src/app/api/backend/[...path]/route.ts`) forwards requests and relays
the backend's `Set-Cookie` (re-scoped to `/api/backend`).

Key properties:

- **Confidential client secret stays on the backend.** The browser never sees it.
- **No tokens in the browser.** Auth is a plain httpOnly `JSESSIONID` session
  cookie, `SameSite=Lax`.
- **Unauthenticated API calls get 401** (not a redirect), so the SPA can detect
  it and start a full-page login. See §4.

---

## 2. Files

New / changed backend files:

- `config/security/SecurityConfig.java` — OAuth2 login, session auth, URL role
  rules, method security, 401-for-API, RP-initiated logout.
- `config/security/KeycloakOidcUserService.java` — maps `realm_access.roles`
  → `ROLE_*` authorities during login.
- `config/security/Roles.java` — role name constants.
- `config/security/CurrentUserController.java` — `GET /api/me`.
- `config/CorsConfig.java` — `CorsConfigurationSource` bean (credentials on).
- `pom.xml` — `spring-boot-starter-security`,
  `spring-boot-starter-oauth2-client`.
- `application.yml` — `spring.security.oauth2.client` provider + registration;
  `server.servlet.session.cookie` (httpOnly, SameSite=Lax); `app.frontend-url`.
- `.env` — `KEYCLOAK_ISSUER_URI`, `KEYCLOAK_CLIENT_ID`,
  `KEYCLOAK_CLIENT_SECRET`, `APP_FRONTEND_URL`.

Example method guards (`@PreAuthorize`) on the Laboratory and Psychology
controllers. All existing business logic, JPA, Flyway, caching, and reporting
are unchanged.

---

## 3. Configuration

`application.yml` (values come from `.env`):

```yaml
spring:
  security:
    oauth2:
      client:
        provider:
          keycloak:
            issuer-uri: ${KEYCLOAK_ISSUER_URI}
            user-name-attribute: preferred_username
        registration:
          keycloak:
            provider: keycloak
            client-id: ${KEYCLOAK_CLIENT_ID}
            client-secret: ${KEYCLOAK_CLIENT_SECRET}
            authorization-grant-type: authorization_code
            scope: [openid, profile, email]
            redirect-uri: ${OAUTH_REDIRECT_URI:http://localhost:3000/api/backend/login/oauth2/code/keycloak}
server:
  servlet:
    session:
      cookie:
        http-only: true
        same-site: lax
        secure: ${SESSION_COOKIE_SECURE:false}   # true under HTTPS in prod
```

`issuer-uri` lets Spring auto-discover the authorization, token, JWKS, userinfo,
and end-session endpoints from `{issuer-uri}/.well-known/openid-configuration`.

**Why `redirect-uri` points at the frontend proxy:** the browser only knows the
frontend origin, so Keycloak must send the `code` back through the proxy
(`/api/backend/login/oauth2/code/keycloak`), which the Next.js proxy forwards to
the backend's real `/login/oauth2/code/keycloak` filter path.

---

## 4. SPA-friendly 401

`SecurityConfig` returns `401 Unauthorized` (instead of a 302 to Keycloak) for:

- any `/api/**` request, and
- any request whose `Accept` header prefers JSON (SPA `fetch`).

This is essential because a `fetch` cannot follow a redirect to Keycloak's HTML
login page. The frontend `AuthProvider` catches the 401 from `GET /api/me` and
performs a full-page navigation to the login entry point.

Browser navigations to non-API paths still get the normal OAuth2 redirect.

---

## 5. Role mapping & module rules

`KeycloakOidcUserService` reads `realm_access.roles` from the OIDC login and
adds `ROLE_<ROLE>` authorities (uppercased), ignoring Keycloak built-ins
(`offline_access`, `uma_authorization`, `default-roles-*`).

URL rules in `SecurityConfig` (matched to real controller paths):

| Endpoint(s)                       | Roles                                                 |
|-----------------------------------|-------------------------------------------------------|
| `/api/dashboard/**`               | ADMIN, INFORMATION, PSYCHOLOGY, LABORATORY, RELEASING |
| `/api/visits/**`                  | ADMIN, INFORMATION                                    |
| `/api/profiles/**`                | ADMIN, INFORMATION, RELEASING                         |
| `/api/psychology-evaluations/**`  | ADMIN, PSYCHOLOGY                                     |
| `/api/laboratory-reports/**`      | ADMIN, LABORATORY                                    |
| `/api/medical-exams/**`           | ADMIN, RELEASING                                     |
| `/api/mlc-records/**`             | ADMIN, RELEASING                                     |
| `/api/landbase-pemes/**`          | ADMIN, RELEASING                                     |
| `/api/panama-certificates/**`     | ADMIN, RELEASING                                     |
| `/api/accounting/**`              | ADMIN, ACCOUNTING (reserved; no controller yet)       |
| `/api/employers/**`               | ADMIN, INFORMATION, RELEASING                         |
| `/api/medical-personnel/**`       | any authenticated                                    |
| `/api/files/**`                   | any authenticated                                    |
| `/api/me`                         | any authenticated                                    |

Public (no auth): `/actuator/health`, `/actuator/info`, Swagger UI &
`/v3/api-docs` (lock these down for a hardened production deploy). `ADMIN` is in
every rule, so it has full access.

The frontend mirrors this map in `frontend/src/lib/roles.ts` for UX gating only;
the backend remains authoritative (403 on insufficient role).

---

## 6. Keycloak realm & client setup

### Realm roles
Create in `centerport-realm` → Realm roles:
`ADMIN`, `INFORMATION`, `PSYCHOLOGY`, `LABORATORY`, `RELEASING`, `ACCOUNTING`.

### Client `centerport-web` (confidential)
- **Client authentication: ON** (a secret is issued — put it in the backend
  `.env` as `KEYCLOAK_CLIENT_SECRET`).
- **Standard flow: ON** (Authorization Code). Direct access grants OFF.
- **Valid redirect URIs:**
  `http://localhost:3000/api/backend/login/oauth2/code/keycloak`
- **Valid post logout redirect URIs:** `http://localhost:3000`
- **Web origins:** `http://localhost:3000`

> Note: the redirect URI is the **frontend proxy** URL, not a backend URL,
> because the browser drives the redirect and only sees the frontend origin.

### Assign roles
Users → pick a user → Role mapping → assign one or more realm roles. A user may
hold several (e.g. `RELEASING` + `LABORATORY`).

---

## 7. Networking (local IP / Docker)

The **backend** must reach Keycloak at `http://192.168.0.15:8086` for OIDC
discovery, the code→token exchange, and JWKS. The **browser** must reach
Keycloak for the login page (steps 2–4 above).

- **Backend on host:** verify with
  `curl http://192.168.0.15:8086/realms/centerport-realm/.well-known/openid-configuration`.
- **Backend in Docker:** `localhost` is the container; use the LAN IP
  `192.168.0.15` (default) or a hostname resolvable in the container. If Keycloak
  is also containerized, share a Docker network and use the service name — but
  then the **issuer** the backend sees must still match what the browser sees, or
  tokens/redirects fail. Keep Keycloak's **Frontend URL** consistent.
- **Different machines:** set `APP_FRONTEND_URL` (and the Keycloak redirect/web
  origins) to the real frontend origin, and `CORS_ALLOWED_ORIGINS` accordingly.

---

## 8. Testing

1. Start Keycloak, create the realm roles, the `centerport-web` client, and a
   test user with one or more roles.
2. Put the client secret in `backend/.env` (`KEYCLOAK_CLIENT_SECRET`).
3. Start the backend (`mvn spring-boot:run`) and frontend (`npm run dev`).
4. Open `http://localhost:3000` → you are redirected to Keycloak → log in →
   redirected back. The sidebar shows only the modules your roles allow.
5. Check identity: the user menu (top-right) shows your name and roles.
6. Direct API probe of the 401 behaviour (no session):
   ```bash
   curl -i http://localhost:3000/api/backend/api/me           # 401
   curl -i http://localhost:3000/api/backend/actuator/health  # 200 (public)
   ```
7. Sign out from the user menu → session cleared and Keycloak SSO ended →
   back at the login.

Expected:

| Scenario                                   | Result |
|--------------------------------------------|--------|
| No session, API call                       | 401    |
| Logged in, role allowed                    | 200    |
| Logged in, role NOT allowed                | 403    |
| Public endpoint, no session                | 200    |

---

## 9. Troubleshooting

**Redirected to login in a loop / no session sticks**
- The proxy must relay `Set-Cookie`. Confirmed in `route.ts` (`relaySetCookies`,
  Path re-scoped to `/api/backend`). Ensure the browser stores the cookie and
  sends it back on `/api/backend/*`.
- `SameSite`/`Secure`: under plain HTTP in dev, `secure` must be `false`
  (default). Setting `SESSION_COOKIE_SECURE=true` on HTTP will drop the cookie.

**401 Unauthorized**
- No session yet (expected before login) or session expired — the SPA redirects
  to login automatically.

**403 Forbidden**
- Logged in but missing the required realm role. Assign it in Keycloak, then log
  out/in to refresh the session's authorities.

**Invalid redirect URI** (Keycloak error page)
- The Keycloak client's Valid Redirect URIs must include
  `http://localhost:3000/api/backend/login/oauth2/code/keycloak` exactly. Update
  `OAUTH_REDIRECT_URI` + Keycloak together if the frontend origin changes.

**Invalid issuer / discovery fails at startup**
- Backend can't reach `{issuer}/.well-known/openid-configuration`, or the issuer
  the backend uses differs from what Keycloak advertises. Align Keycloak Frontend
  URL and `KEYCLOAK_ISSUER_URI`.

**Missing roles in the session**
- Role not assigned, or the `roles` client scope is not mapped so
  `realm_access.roles` is absent. Ensure the realm role is assigned and the
  `roles` scope is on the client.

**CORS errors**
- With the same-origin proxy you normally won't hit CORS. If calling the backend
  directly cross-origin, add the exact origin to `CORS_ALLOWED_ORIGINS` (no `*`
  with credentials).

**Keycloak unreachable (backend)**
- Startup or login fails. From the backend host/container:
  `curl http://192.168.0.15:8086/realms/centerport-realm/.well-known/openid-configuration`.
  Fix firewall / Docker networking / hostname resolution.

**Logout doesn't end the Keycloak session**
- Logout uses RP-initiated logout (`OidcClientInitiatedLogoutSuccessHandler`).
  Ensure the client's Valid post logout redirect URIs include the frontend URL.

---

## 10. Adding an Accounting controller

The `/api/accounting/**` rule is reserved. A new controller only needs the base
path — authorization is already enforced (ADMIN or ACCOUNTING). Optionally add
`@PreAuthorize("hasAnyRole('ADMIN','ACCOUNTING')")` for defense in depth.
