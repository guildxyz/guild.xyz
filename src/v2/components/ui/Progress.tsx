"use client"

import { cn } from "@/lib/utils"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  FunctionComponent,
  forwardRef,
} from "react"

const ProgressRoot = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
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

const ProgressIndicator = forwardRef<
  ElementRef<FunctionComponent<ProgressPrimitive.ProgressIndicatorProps>>,
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
