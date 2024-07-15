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
        default:
          "text-secondary-foreground hover:bg-secondary data-[state=on]:bg-secondary active:bg-secondary-hover",
        primary:
          "bg-transparent hover:bg-accent/50 hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        mono: "text-white hover:bg-white/10 data-[state=on]:bg-white/15 hover:text-white data-[state=on]:text-white",
        outline:
          "border border-input bg-transparent hover:bg-accent/50 hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2.5",
        lg: "h-11 px-5 font-semibold text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
