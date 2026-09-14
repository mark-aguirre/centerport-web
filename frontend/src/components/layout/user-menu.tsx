"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { startLogout } from "@/lib/auth";

/**
 * Header user menu: shows the signed-in user's initials, name, roles, and a
 * sign-out action. Sign-out triggers the backend logout, which ends both the
 * app session and the Keycloak SSO session.
 */
export function UserMenu() {
  const { user } = useAuth();

  const displayName = user?.full_name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open user menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                {initials || "CP"}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
            {user?.email && (
              <span className="text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {user && user.roles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Roles
              </DropdownMenuLabel>
              <div className="flex flex-wrap gap-1 px-1.5 pb-1.5">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => startLogout()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
