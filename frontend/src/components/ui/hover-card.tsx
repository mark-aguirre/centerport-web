"use client"

import * as React from "react"
import { Popover as HoverCardPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function HoverCard({ ...props }: HoverCardPrimitive.Root.Props) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: HoverCardPrimitive.Trigger.Props) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardPrimitive.Popup.Props &
    Pick<HoverCardPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Positioner
      align={align}
      sideOffset={sideOffset}
      className="isolate z-50 outline-none"
    >
      <HoverCardPrimitive.Popup
        ref={ref}
        data-slot="hover-card-content"
        className={cn(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Positioner>
  </HoverCardPrimitive.Portal>
))
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardTrigger, HoverCardContent }