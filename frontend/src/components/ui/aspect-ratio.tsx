"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { ratio?: number }
>(({ className, ratio = 1, style, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="aspect-ratio"
    className={cn("relative w-full overflow-hidden", className)}
    style={{
      ...style,
      aspectRatio: ratio,
    }}
    {...props}
  >
    {children}
  </div>
))
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }