"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

import { cn } from "@/lib/utils"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsiblePrimitive.Panel.Props
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    data-slot="collapsible-content"
    className={cn(
      "overflow-hidden data-closed:animate-collapsible-up data-open:animate-collapsible-down",
      className
    )}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }