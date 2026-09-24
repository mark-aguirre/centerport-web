"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, groupNavigation, buildNavHref } from "@/config/navigation";
import { useAuth } from "@/components/auth-provider";
import { useSelectedPatient } from "@/hooks/use-selected-patient";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Ship } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

/**
 * Slide-out mobile navigation drawer.
 *
 * Opens as a left-side sheet overlay with the full navigation list.
 * Active link is highlighted based on the current pathname. Includes
 * app branding and version footer.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { canRoute } = useAuth();
  // Carry the selected seafarer into per-seafarer medical modules.
  const selectedPatientId = useSelectedPatient();
  const visibleNavigation = navigation.filter((item) => canRoute(item.href));
  const navigationGroups = groupNavigation(visibleNavigation);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="h-16 flex-row items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Ship className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <SheetTitle className="text-lg font-bold">CenterPort</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-4">
            {navigationGroups.map((group, groupIndex) => (
              <div
                key={group.label ?? `group-${groupIndex}`}
                className="flex flex-col gap-1"
              >
                {group.label && (
                  <span className="px-3 pb-0.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    {group.label}
                  </span>
                )}

                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={buildNavHref(item.href, selectedPatientId)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.shortTitle ?? item.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            CenterPort v0.1.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}