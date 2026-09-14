"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type CurrentUser } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { canAccessRoute, hasAnyRole, type Role } from "@/lib/roles";

/**
 * Authentication state exposed to the app.
 */
interface AuthState {
  /** The current user, or null while loading / unauthenticated. */
  user: CurrentUser | null;
  /** True while the initial `/api/me` request is in flight. */
  loading: boolean;
  /** The user's realm roles (empty when unauthenticated). */
  roles: string[];
  /** True if the user holds any of the given roles (ADMIN always passes). */
  can: (required: Role[]) => boolean;
  /** True if the user may access a top-level route href. */
  canRoute: (href: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Loads the authenticated user from the backend (`GET /api/me`) and exposes it
 * to the app. If the backend reports the session is missing or expired (401),
 * the redirect to Keycloak login is handled centrally by the HTTP client (see
 * `handleUnauthorized` in `lib/http-client.ts`), which covers this initial load
 * as well as any later call once the session times out mid-use.
 *
 * Because the backend owns the session, this provider does not manage tokens —
 * it only reflects the server's view of who is signed in.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const me = await api.auth.me();
        if (!cancelled) {
          setUser(me);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // No / expired session. The HTTP client already kicked off the
          // full-page redirect to Keycloak login; keep the splash up while the
          // browser navigates away instead of flashing an error state.
          return;
        }
        // Other errors (e.g. backend down): stop loading so the app can show
        // an error state rather than hang.
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const roles = useMemo(() => user?.roles ?? [], [user]);

  const can = useCallback(
    (required: Role[]) => hasAnyRole(roles, required),
    [roles]
  );
  const canRoute = useCallback(
    (href: string) => canAccessRoute(href, roles),
    [roles]
  );

  return (
    <AuthContext.Provider value={{ user, loading, roles, can, canRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Access the current authentication state. Must be used within AuthProvider. */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
