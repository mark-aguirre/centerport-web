"use client";

import { HeartPulse, Hospital, LogOut } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { startLogout } from "@/lib/auth";
import { POS_CLINIC } from "@/components/transaction/pos/pos-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Light header bar for the counter POS workspace.
 *
 * Three zones across one row: the CenterPort brand mark and workspace name on
 * the left, the clinic the counter belongs to in the middle-right, and the
 * signed-in operator (with the sign-out menu) at the far right. The band is
 * near-white with a mint tint so the dark rail below it reads as the only heavy
 * element on the page.
 *
 * Rendered only inside the `/sale` page, so it does not affect the shared app
 * header used elsewhere.
 */
export function PosHeader() {
  const { user } = useAuth();

  const operatorName = user?.full_name || user?.username || "Operator";
  const initials = operatorName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#0f4435]/10 bg-gradient-to-r from-[#f4faf7] via-white to-[#f4faf7] px-4 md:px-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#118a57]/10 text-[#0f7a4d]">
          <HeartPulse className="h-6 w-6" />
        </span>
        <h1 className="flex items-baseline gap-2 text-xl font-bold tracking-tight text-[#0f4435]">
          CenterPort
          <span className="text-sm font-medium text-[#0f4435]/50">
            Clinic POS
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Clinic the counter is operating for. Hidden on narrow screens — the
            operator block is the one piece that has to stay reachable. */}
        <div className="hidden items-center gap-2.5 md:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#118a57]/10 text-[#0f7a4d]">
            <Hospital className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#0f4435]">
              {POS_CLINIC.name}
            </span>
            <span className="text-[11px] text-[#0f4435]/55">
              {POS_CLINIC.tagline}
            </span>
          </span>
        </div>

        <span
          aria-hidden="true"
          className="hidden h-8 w-px bg-[#0f4435]/12 md:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 text-left outline-none transition-colors hover:bg-[#118a57]/8 focus-visible:ring-2 focus-visible:ring-[#118a57]/40"
                aria-label="Open operator menu"
              >
                <div className="hidden text-right leading-tight sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0f4435]/45">
                    Operator
                  </p>
                  <p className="text-sm font-semibold text-[#0f4435]">
                    {operatorName}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d4238] text-sm font-semibold text-white">
                  {initials || "OP"}
                </div>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {operatorName}
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
      </div>
    </header>
  );
}
