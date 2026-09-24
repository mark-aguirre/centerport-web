import { AppLayout } from "@/components/layout/app-layout";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGate } from "@/components/auth-gate";
import { LandingRedirect } from "@/components/layout/landing-redirect";

/**
 * Route group layout for authenticated app pages.
 *
 * Wraps all `(app)` routes in the `AuthProvider` (which loads the current user
 * from the backend session and redirects to Keycloak login when no session
 * exists) and the `AppLayout` shell (sidebar, header, content area).
 */
export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGate>
        <LandingRedirect />
        <AppLayout>{children}</AppLayout>
      </AuthGate>
    </AuthProvider>
  );
}
