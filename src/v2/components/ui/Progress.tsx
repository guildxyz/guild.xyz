"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cn } from "@/lib/utils"

const ProgressRoot = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  />
))

const ProgressIndicator = React.forwardRef<
  React.ElementRef<
    React.FunctionComponent<ProgressPrimitive.ProgressIndicatorProps>
  >,
  ProgressPrimitive.ProgressIndicatorProps & { value: number }
>(({ className, value, style, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    className={cn(
      "h-full w-full flex-1 rounded-r-full bg-primary transition-all",
      className
    )}
    style={{ transform: `translateX(-${(1 - (value || 0)) * 100}%)`, ...style }}
    ref={ref}
    {...props}
  />
))

export { ProgressIndicator, ProgressRoot }
