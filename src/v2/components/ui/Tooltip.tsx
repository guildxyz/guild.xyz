"use client"

import { cn } from "@/lib/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { VariantProps, cva } from "class-variance-authority"
import { ComponentPropsWithoutRef, ElementRef, FC, forwardRef } from "react"

const tooltipVariants = cva(
  "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-tooltip max-w-sm animate-in px-3 py-1.5 text-center font-medium font-sans text-sm shadow-md data-[state=closed]:animate-out",
  {
    variants: {
      variant: {
        tooltip:
          "bg-tooltip text-tooltip-foreground rounded-xl [&_svg.tooltip-arrow]:fill-tooltip",
        popover:
          "bg-popover text-popover-foreground rounded-lg outline outline-1 outline-border [&_svg.tooltip-arrow]:fill-popover [&_svg.tooltip-arrow]:[filter:drop-shadow(1px_0_0_hsl(var(--border)))_drop-shadow(-1px_0_0_hsl(var(--border)))_drop-shadow(0_1px_0_hsl(var(--border)))]",
      },
    },
    defaultVariants: {
      variant: "tooltip",
    },
  }
)

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

export interface TooltipContentProps
  extends ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {}

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, className }))}
    {...props}
  >
    {children}
    <TooltipPrimitive.Arrow className="tooltip-arrow" />
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipPortal = TooltipPrimitive.Portal

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipPortal }
