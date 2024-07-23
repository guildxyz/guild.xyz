"use client"

import { cn } from "@/lib/utils"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapse-closed data-[state=open]:animate-collapse-open",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
))

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
