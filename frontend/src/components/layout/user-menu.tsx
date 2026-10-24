"use client";

import { ChevronDown, LogOut } from "lucide-react";
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
import { primaryRoleLabel } from "@/lib/roles";

interface UserMenuProps {
  /**
   * `chip` shows the avatar alongside the user's name and role (top
   * navigation); `avatar` shows the avatar alone (compact headers).
   */
  variant?: "avatar" | "chip";
}

/**
 * Header user menu: shows the signed-in user's initials, name, roles, and a
 * sign-out action. Sign-out triggers the backend logout, which ends both the
 * app session and the Keycloak SSO session.
 *
 * @param variant - Trigger presentation, see {@link UserMenuProps.variant}.
 */
export function UserMenu({ variant = "avatar" }: UserMenuProps) {
  const { user, roles } = useAuth();

  const displayName = user?.full_name || user?.username || "User";
  const roleLabel = primaryRoleLabel(roles);
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatar = (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
        {initials || "CP"}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          variant === "chip" ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-0.5 pr-1.5 pl-0.5 transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
            >
              {avatar}
              <span className="hidden min-w-0 flex-col items-start leading-tight lg:flex">
                <span className="max-w-36 truncate text-sm font-semibold">
                  {displayName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {roleLabel}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open user menu"
            >
              {avatar}
            </button>
          )
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
                    className="rounded bg-accent px-1.5 py-0.5 text-[11px] font-medium text-accent-foreground"
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
