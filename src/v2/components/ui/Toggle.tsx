"use client"

import { cn } from "@/lib/utils"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground font-medium",
  {
    variants: {
      variant: {
        secondary:
          "text-secondary-foreground hover:bg-secondary data-[state=on]:bg-secondary active:bg-secondary-hover",
        primary:
          "hover:bg-secondary-hover active:bg-secondary-active data-[state=on]:bg-primary data-[state=on]:text-primary-foreground bg-secondary text-secondary-foreground",
        mono: "text-white hover:bg-white/10 data-[state=on]:bg-white/15 hover:text-white data-[state=on]:text-white",
      },
      size: {
        sm: "h-8 px-2.5",
        md: "h-10 px-3",
        lg: "h-11 px-5 font-semibold text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

const Toggle = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
