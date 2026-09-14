I am developing a full-stack application using **Next.js as the frontend and Spring Boot as the backend**. I want to integrate **Keycloak as the authentication and authorization server**.

Please implement Keycloak integration into my existing Spring Boot project. First, inspect my existing project structure, Spring Boot version, dependencies, security configuration, controllers, and API endpoints. Do not unnecessarily rewrite or remove existing functionality.

## 1. Keycloak configuration

My Keycloak OpenID Connect configuration is:

* **Keycloak server:** `http://192.168.0.15:8086`
* **Realm:** `centerport-realm`
* **Issuer URI:** `http://192.168.0.15:8086/realms/centerport-realm`
* **JWKS URI:** `http://192.168.0.15:8086/realms/centerport-realm/protocol/openid-connect/certs`
* **Authorization endpoint:** `http://192.168.0.15:8086/realms/centerport-realm/protocol/openid-connect/auth`
* **Token endpoint:** `http://192.168.0.15:8086/realms/centerport-realm/protocol/openid-connect/token`
* **User information endpoint:** `http://192.168.0.15:8086/realms/centerport-realm/protocol/openid-connect/userinfo`
* **Logout endpoint:** `http://192.168.0.15:8086/realms/centerport-realm/protocol/openid-connect/logout`

Use the issuer URI for Spring Security's JWT configuration rather than manually configuring the signing keys.

The Keycloak server is hosted on a local network IP. Make sure you explain any network, firewall, Docker, or hostname requirements needed for the Spring Boot application to reach Keycloak.

## 2. Required roles

My application has the following Keycloak realm roles:

* `ADMIN`
* `INFORMATION`
* `PSYCHOLOGY`
* `LABORATORY`
* `RELEASING`
* `ACCOUNTING`

Implement role-based access control using these roles.

Assume that `ADMIN` should have access to all application modules unless the existing project indicates otherwise.

The expected access rules are:

* `ADMIN` → all modules
* `INFORMATION` → Information module(visit and Profile or patient, Dashboard)
* `PSYCHOLOGY` → Psychology module and Dashboard
* `LABORATORY` → Laboratory module and Dashboard
* `RELEASING` → Releasing module(Seabase or Medical, Landbase, Profile or patient,panama, Dashboard)
* `ACCOUNTING` → Accounting module

A user may have multiple roles.

## 3. Spring Boot implementation requirements

Implement the following:

### Dependencies

Add the correct dependencies for my Spring Boot version.

If using Spring Boot 3.x and Spring Security 6.x, use:

* `spring-boot-starter-security`
* `spring-boot-starter-oauth2-resource-server`
* Any other necessary dependencies

Do not use the deprecated Keycloak Spring adapter unless there is a specific compatibility reason.

### JWT authentication

Configure Spring Boot as an OAuth2 Resource Server.

Use:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://192.168.0.15:8086/realms/centerport-realm
```

Validate JWT signatures, issuer, expiration, and other relevant standard claims.

### Keycloak role mapping

Keycloak realm roles are expected to appear in the JWT under:

```json
{
  "realm_access": {
    "roles": [
      "ADMIN",
      "LABORATORY"
    ]
  }
}
```

Implement a custom JWT authority converter that maps:

* `ADMIN` → `ROLE_ADMIN`
* `INFORMATION` → `ROLE_INFORMATION`
* `PSYCHOLOGY` → `ROLE_PSYCHOLOGY`
* `LABORATORY` → `ROLE_LABORATORY`
* `RELEASING` → `ROLE_RELEASING`
* `ACCOUNTING` → `ROLE_ACCOUNTING`

Also handle missing or empty `realm_access.roles` safely.

If the existing project uses client roles instead of realm roles, inspect the token structure and adapt the implementation accordingly.

### Spring Security configuration

Create or update the appropriate security configuration.

Requirements:

* Enable JWT authentication.
* Enable method-level security using `@EnableMethodSecurity`.
* Configure stateless API authentication.
* Disable CSRF only if appropriate for a stateless bearer-token API.
* Permit public endpoints such as health checks or login-independent endpoints if they exist.
* Require authentication for protected endpoints.
* Return `401 Unauthorized` for missing or invalid tokens.
* Return `403 Forbidden` for authenticated users without sufficient permissions.
* Do not permit all endpoints in development as a workaround.

Use modern Spring Security configuration with `SecurityFilterChain`.

### Role-protected endpoints

Create or update example controllers demonstrating:

```java
@PreAuthorize("hasAnyRole('ADMIN', 'LABORATORY')")
```

For example:

* `/api/laboratory/**`
* `/api/information/**`
* `/api/psychology/**`
* `/api/releasing/**`
* `/api/accounting/**`
* `/api/admin/**`

Ensure that role restrictions are applied consistently and that `ADMIN` has the intended access.

Do not expose sensitive information or allow users to modify their own roles through ordinary API requests.

## 4. Next.js integration

My frontend runs locally at:

```text
http://localhost:3000
```

Explain how Next.js should authenticate users through Keycloak and call the Spring Boot API using an access token.

Before implementing frontend authentication, determine whether the project uses:

* Auth.js / NextAuth
* `keycloak-js`
* Another authentication library
* A custom login implementation

If an authentication library is already present, integrate with it instead of introducing a second authentication system.

Explain how to:

1. Redirect users to Keycloak for login.
2. Obtain an access token.
3. Send the access token to Spring Boot using:

```http
Authorization: Bearer <access_token>
```

4. Handle token expiration and refresh.
5. Log out users from Keycloak.
6. Protect frontend routes based on authentication and roles.

Do not expose a confidential client secret in browser-side Next.js code.

If using Auth.js, explain the correct callback URL and how to securely manage the access token for backend API requests.

## 5. CORS configuration

Configure CORS correctly for local development:

* Next.js: `http://localhost:3000`
* Spring Boot: use the actual backend port configured in the project.

Allow only the necessary origins, methods, and headers.

Do not use `allowedOrigins("*")` together with credentials.

If the frontend and backend are hosted on different machines, explain how the origin and network address must be configured.

## 6. Deliverables

Provide a complete, production-quality implementation based on my existing project.

Include:

1. Required Maven dependencies.
2. `application.yml` or `application.properties`.
3. JWT role converter.
4. Spring Security configuration.
5. CORS configuration, if needed.
6. Example protected controllers.
7. Next.js integration instructions.
8. Keycloak client configuration.
9. Required realm roles and user-role assignments.
10. Example API requests using a bearer token.
11. Instructions for testing authentication and authorization.
12. Troubleshooting for common errors:

    * `401 Unauthorized`
    * `403 Forbidden`
    * Invalid issuer
    * JWT signature validation failure
    * Missing roles in the token
    * CORS errors
    * Keycloak unreachable
    * Incorrect redirect URI

## 7. Important implementation rules

* Use the actual Spring Boot and Spring Security versions from my project.
* Preserve existing business logic and database functionality.
* Do not invent existing classes, packages, or endpoints without clearly identifying new files.
* Show the complete contents of every new or modified file.
* Explain where each file should be placed.
* Explain every important configuration decision.
* Use secure defaults.
* Do not hardcode passwords, access tokens, or client secrets.
* Do not use the password grant for normal browser authentication.
* Include a clear step-by-step testing procedure.
* If any required information is missing, identify it and make reasonable assumptions rather than silently guessing.

Start by analyzing my existing project, then provide the implementation plan and the code changes needed to integrate Keycloak.
