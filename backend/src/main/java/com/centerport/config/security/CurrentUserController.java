package com.centerport.config.security;

import com.centerport.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exposes the identity and roles of the currently authenticated user, derived
 * from the Keycloak session established by the backend-driven login.
 *
 * <p>The frontend calls {@code GET /api/me} after the session is established to
 * learn who the user is and which application roles they hold, so it can drive
 * route protection and conditional UI. It is read-only and reflects only what
 * the session already asserts — a user can never change their own roles here.
 */
@RestController
@RequestMapping("/api/me")
@Tag(name = "Current User", description = "Identity and roles of the authenticated user")
public class CurrentUserController {

    /**
     * Minimal projection of the authenticated principal.
     *
     * @param username  Keycloak {@code preferred_username}
     * @param email     user email, if present
     * @param fullName  user display name ({@code name} claim), if present
     * @param subject   Keycloak user id ({@code sub})
     * @param roles     application realm roles (without the {@code ROLE_} prefix)
     */
    public record CurrentUser(
            String username,
            String email,
            String fullName,
            String subject,
            List<String> roles) {
    }

    @GetMapping
    @Operation(summary = "Get the current authenticated user and their roles")
    public ResponseEntity<ApiResponse<CurrentUser>> me(@AuthenticationPrincipal OidcUser user) {
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .toList();

        CurrentUser dto = new CurrentUser(
                user.getPreferredUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getSubject(),
                roles);

        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
