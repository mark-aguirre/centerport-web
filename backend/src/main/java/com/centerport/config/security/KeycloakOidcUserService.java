package com.centerport.config.security;

import com.nimbusds.jwt.JWTParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Loads the OIDC user during the backend-driven Keycloak login and augments its
 * authorities with the realm roles found in the ID token / userinfo response.
 *
 <p>Roles reach the token two ways, and both are supported here:
 * <ul>
 *   <li><b>Realm roles</b> under the {@code realm_access.roles} claim:
 *       <pre>{@code { "realm_access": { "roles": ["ADMIN", "LABORATORY"] } } }</pre>
 *       (This also covers roles a user inherits from a group when the group has
 *       realm roles mapped to it — Keycloak folds those into this claim.)</li>
 *   <li><b>Group membership</b> under the {@code groups} claim, when users are
 *       organised into groups whose names are the roles and a "Group Membership"
 *       mapper adds them to the token:
 *       <pre>{@code { "groups": ["/ADMIN", "/LABORATORY"] } }</pre>
 *       Group paths are normalised to their leaf segment ({@code /ADMIN ->
 *       ADMIN}), so nested and full-path group entries both resolve.</li>
 * </ul>
 *
 * <p>Each resolved name {@code X} becomes a {@code ROLE_X} authority
 * (uppercased), so Spring's {@code hasRole(..)} / {@code hasAnyRole(..)} and
 * {@code @PreAuthorize} work as expected. Keycloak's built-in roles/groups
 * ({@code offline_access}, {@code uma_authorization}, {@code default-roles-*})
 * are ignored. Missing or empty claims simply yield no application roles (the
 * user then gets 403 on protected endpoints).
 *
 * <p><b>Note:</b> the {@code groups} claim only appears if a Group Membership
 * protocol mapper is configured on the Keycloak client (adding {@code groups}
 * to the ID token / userinfo). Without it, rely on group→realm-role mapping so
 * roles arrive via {@code realm_access.roles} instead.
 *
 * <p><b>Access-token fallback:</b> by default Keycloak adds {@code realm_access.roles}
 * to the <em>access token</em> but not necessarily to the ID token / userinfo
 * (the "Add to ID token" setting on the realm-roles mapper is often off). Since
 * {@link OidcUser#getClaims()} exposes ID-token/userinfo claims, roles can be
 * missing there even when correctly assigned. To be robust regardless of that
 * mapper toggle, we also parse the access token JWT and read its
 * {@code realm_access.roles} / {@code groups} claims. All sources are merged and
 * deduped.
 *
 * <p>The default OIDC scope authorities ({@code SCOPE_openid}, etc.) are kept in
 * addition to the mapped realm roles.
 */
@Slf4j
@Service
public class KeycloakOidcUserService extends OidcUserService {

    private static final String REALM_ACCESS_CLAIM = "realm_access";
    private static final String ROLES_CLAIM = "roles";
    private static final String GROUPS_CLAIM = "groups";
    private static final String ROLE_PREFIX = "ROLE_";

    private static final List<String> IGNORED_ROLES = List.of(
            "offline_access",
            "uma_authorization");

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        Set<GrantedAuthority> authorities = new LinkedHashSet<>(oidcUser.getAuthorities());
        // Roles may arrive as realm roles and/or via group membership; merge both.
        // The LinkedHashSet dedupes when a role appears through both channels.
        authorities.addAll(extractRealmRoleAuthorities(oidcUser.getClaims()));
        authorities.addAll(extractGroupAuthorities(oidcUser.getClaims()));

        // The ID token / userinfo may omit realm_access.roles depending on the
        // Keycloak mapper's "Add to ID token" setting; the access token carries
        // it by default. Read it too so role resolution is not dependent on that
        // toggle.
        Map<String, Object> accessTokenClaims = parseAccessTokenClaims(userRequest);
        authorities.addAll(extractRealmRoleAuthorities(accessTokenClaims));
        authorities.addAll(extractGroupAuthorities(accessTokenClaims));

        // preferred_username is configured as the name attribute in application.yml.
        String nameAttributeKey = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        if (nameAttributeKey == null || nameAttributeKey.isBlank()) {
            return new DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
        }
        return new DefaultOidcUser(
                authorities, oidcUser.getIdToken(), oidcUser.getUserInfo(), nameAttributeKey);
    }

    /**
     * Parses the Keycloak access token (a JWT) from the login request and
     * returns its claims. Keycloak reliably includes {@code realm_access.roles}
     * here even when the ID token omits it. Any parsing failure is logged and
     * yields empty claims, so login is never broken by this best-effort read.
     */
    private Map<String, Object> parseAccessTokenClaims(OidcUserRequest userRequest) {
        if (userRequest.getAccessToken() == null) {
            return Map.of();
        }
        String tokenValue = userRequest.getAccessToken().getTokenValue();
        if (tokenValue == null || tokenValue.isBlank()) {
            return Map.of();
        }
        try {
            return JWTParser.parse(tokenValue).getJWTClaimsSet().getClaims();
        } catch (ParseException ex) {
            log.warn("Could not parse Keycloak access token for role extraction: {}", ex.getMessage());
            return Map.of();
        }
    }

    /** Reads realm roles from {@code realm_access.roles}. */
    @SuppressWarnings("unchecked")
    private Collection<GrantedAuthority> extractRealmRoleAuthorities(Map<String, Object> claims) {
        Object realmAccess = claims.get(REALM_ACCESS_CLAIM);
        if (!(realmAccess instanceof Map<?, ?> realmAccessMap)) {
            return List.of();
        }

        Object rolesObj = ((Map<String, Object>) realmAccessMap).get(ROLES_CLAIM);
        if (!(rolesObj instanceof Collection<?> roles)) {
            return List.of();
        }

        return mapRoleNames(roles);
    }

    /**
     * Reads group memberships from the {@code groups} claim and treats each
     * group name as a role. Group paths (e.g. {@code /ADMIN} or
     * {@code /Parent/LABORATORY}) are reduced to their leaf segment.
     */
    private Collection<GrantedAuthority> extractGroupAuthorities(Map<String, Object> claims) {
        Object groupsObj = claims.get(GROUPS_CLAIM);
        if (!(groupsObj instanceof Collection<?> groups)) {
            return List.of();
        }

        return mapRoleNames(groups);
    }

    /**
     * Maps a collection of raw role/group names to {@code ROLE_*} authorities:
     * strips any group path, trims, drops ignored built-ins, uppercases, and
     * prefixes {@code ROLE_}. Plain role names (no {@code /}) pass through the
     * path-stripping step unchanged.
     */
    private Collection<GrantedAuthority> mapRoleNames(Collection<?> names) {
        return names.stream()
                .filter(Objects::nonNull)
                .map(Object::toString)
                .map(this::stripGroupPath)
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .filter(name -> !isIgnored(name))
                .map(name -> ROLE_PREFIX + name.toUpperCase(Locale.ROOT))
                .distinct()
                .map(name -> (GrantedAuthority) new SimpleGrantedAuthority(name))
                .toList();
    }

    /**
     * Reduces a Keycloak group path to its leaf segment
     * ({@code /Parent/LABORATORY -> LABORATORY}). Values without a {@code /}
     * (plain role names) are returned unchanged.
     */
    private String stripGroupPath(String value) {
        int lastSlash = value.lastIndexOf('/');
        return lastSlash >= 0 ? value.substring(lastSlash + 1) : value;
    }

    private boolean isIgnored(String role) {
        String lower = role.toLowerCase(Locale.ROOT);
        return lower.startsWith("default-roles-") || IGNORED_ROLES.contains(lower);
    }
}
