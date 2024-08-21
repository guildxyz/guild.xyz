"use client"

import { cn } from "@/lib/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { ComponentPropsWithoutRef, ElementRef, FC, forwardRef } from "react"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip: FC<ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>> = ({
  ...props
}) => <TooltipPrimitive.Root delayDuration={0} {...props} />

const TooltipTrigger = forwardRef<
  ElementRef<typeof TooltipPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    className={cn(
      "outline-none focus-visible:ring-4 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {children}
  </TooltipPrimitive.Trigger>
))

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-tooltip max-w-sm animate-in overflow-hidden rounded-xl bg-tooltip px-3 py-1.5 text-center font-medium font-sans text-sm text-tooltip-foreground shadow-md data-[state=closed]:animate-out",
      className
    )}
    {...props}
  >
    {children}
    {/* <TooltipPrimitive.Arrow className="fill-tooltip" /> */}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
