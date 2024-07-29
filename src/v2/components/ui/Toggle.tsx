"use client"

import { cn } from "@/lib/utils"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  {
    variants: {
      variant: {
        solid:
          "bg-[hsl(var(--toggle-bg))] hover:bg-[hsl(var(--toggle-bg-hover))] active:bg-[hsl(var(--toggle-bg-active))] text-[hsl(var(--toggle-foreground))]",
        ghost:
          "bg-[hsl(var(--toggle-bg-subtle)/0)] hover:bg-[hsl(var(--toggle-bg-subtle)/0.12)] active:bg-[hsl(var(--toggle-bg-subtle)/0.24)] text-[hsl(var(--toggle-foreground-subtle))]",
        subtle:
          "bg-[hsl(var(--toggle-bg-subtle)/0.12)] hover:bg-[hsl(var(--toggle-bg-subtle)/0.24)] active:bg-[hsl(var(--toggle-bg-subtle)/0.36)] text-[hsl(var(--toggle-foreground-subtle))]",
        outline:
          "bg-[hsl(var(--toggle-bg-subtle)/0)] hover:bg-[hsl(var(--toggle-bg-subtle)/0.12)] active:bg-[hsl(var(--toggle-bg-subtle)/0.24)] text-[hsl(var(--toggle-foreground-subtle))] border-2 border-[hsl(var(--toggle-foreground-subtle))]",
        unstyled: "",
        mono: "text-white hover:bg-white/10 data-[state=on]:bg-white/15 hover:text-white data-[state=on]:text-white",
      },
      colorScheme: {
        primary:
          "[--toggle-bg:var(--primary)] [--toggle-bg-hover:var(--primary-hover)] [--toggle-bg-active:var(--primary-active)] [--toggle-foreground:var(--primary-foreground)] [--toggle-bg-subtle:var(--primary-subtle)] [--toggle-foreground-subtle:var(--primary-subtle-foreground)]",
        secondary:
          "[--toggle-bg:var(--secondary)] [--toggle-bg-hover:var(--secondary-hover)] [--toggle-bg-active:var(--secondary-active)] [--toggle-foreground:var(--secondary-foreground)] [--toggle-bg-subtle:var(--secondary-subtle)] [--toggle-foreground-subtle:var(--secondary-subtle-foreground)]",
      },
      size: {
        sm: "h-8 px-2.5",
        md: "h-10 px-3",
        lg: "h-11 px-5 font-semibold text-base",
        icon: "size-9",
      },
    },
    compoundVariants: [
      {
        colorScheme: "secondary",
        variant: "outline",
        className: "border-[hsl(var(--secondary))]",
      },
    ],
    defaultVariants: {
      variant: "solid",
      colorScheme: "secondary",
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
