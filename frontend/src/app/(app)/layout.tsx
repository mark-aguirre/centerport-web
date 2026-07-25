import { AppLayout } from "@/components/layout/app-layout";

/**
 * Route group layout for authenticated app pages.
 *
 * Wraps all `(app)` routes in the `AppLayout` shell which provides
 * the sidebar navigation, header, and responsive content area.
 */
export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
