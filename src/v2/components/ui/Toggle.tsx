"use client"

import { cn } from "@/lib/utils"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { type VariantProps, cva } from "class-variance-authority"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const buttonVariants = cva(
  "font-semibold inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl text-base text-ellipsis overflow-hidden gap-1.5",
  {
    variants: {
      variant: {
        solid:
          "bg-[hsl(var(--button-bg))] hover:bg-[hsl(var(--button-bg-hover))] active:bg-[hsl(var(--button-bg-active))] text-[hsl(var(--button-foreground))]",
        ghost:
          "bg-[hsl(var(--button-bg-subtle)/0)] hover:bg-[hsl(var(--button-bg-subtle)/0.12)] active:bg-[hsl(var(--button-bg-subtle)/0.24)] text-[hsl(var(--button-foreground-subtle))]",
        subtle:
          "bg-[hsl(var(--button-bg-subtle)/0.12)] hover:bg-[hsl(var(--button-bg-subtle)/0.24)] active:bg-[hsl(var(--button-bg-subtle)/0.36)] text-[hsl(var(--button-foreground-subtle))]",
        outline:
          "bg-[hsl(var(--button-bg-subtle)/0)] hover:bg-[hsl(var(--button-bg-subtle)/0.12)] active:bg-[hsl(var(--button-bg-subtle)/0.24)] text-[hsl(var(--button-foreground-subtle))] border-2 border-[hsl(var(--button-foreground-subtle))]",
        unstyled: "",
      },
      // TODO: we could extract this to a Tailwind plugin
      colorScheme: {
        primary:
          "[--button-bg:var(--primary)] [--button-bg-hover:var(--primary-hover)] [--button-bg-active:var(--primary-active)] [--button-foreground:var(--primary-foreground)] [--button-bg-subtle:var(--primary-subtle)] [--button-foreground-subtle:var(--primary-subtle-foreground)]",
        secondary:
          "[--button-bg:var(--secondary)] [--button-bg-hover:var(--secondary-hover)] [--button-bg-active:var(--secondary-active)] [--button-foreground:var(--secondary-foreground)] [--button-bg-subtle:var(--secondary-subtle)] [--button-foreground-subtle:var(--secondary-subtle-foreground)]",
        info: "[--button-bg:var(--info)] [--button-bg-hover:var(--info-hover)]  [--button-bg-active:var(--info-active)] [--button-foreground:var(--info-foreground)] [--button-bg-subtle:var(--info-subtle)] [--button-foreground-subtle:var(--info-subtle-foreground)]",
        destructive:
          "[--button-bg:var(--destructive)] [--button-bg-hover:var(--destructive-hover)] [--button-bg-active:var(--destructive-active)] [--button-foreground:var(--destructive-foreground)] [--button-bg-subtle:var(--destructive-subtle)] [--button-foreground-subtle:var(--destructive-subtle-foreground)]",
        success:
          "[--button-bg:var(--success)] [--button-bg-hover:var(--success-hover)] [--button-bg-active:var(--success-active)] [--button-foreground:var(--success-foreground)] [--button-bg-subtle:var(--success-subtle)] [--button-foreground-subtle:var(--success-subtle-foreground)]",
      },
      size: {
        xs: "h-6 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-sm",
        md: "h-11 px-4 py-2",
        lg: "h-12 px-6 py-4 text-lg",
        xl: "h-14 px-6 py-4 text-lg gap-2",
        icon: "h-10 w-10",
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

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground font-medium",
  {
    variants: {
      variant: {
        solid:
          "bg-[hsl(var(--toggle-bg))] hover:bg-[hsl(var(--toggle-bg-hover))] active:bg-[hsl(var(--toggle-bg-active))] text-[hsl(var(--toggle-foreground))]",
        ghost:
          "bg-[hsl(var(--toggle-bg-subtle)/0)] hover:bg-[hsl(var(--toggle-bg-subtle)/0.12)] active:bg-[hsl(var(--toggle-bg-subtle)/0.24)] text-[hsl(var(--toggle-foreground-subtle))]",
        subtle: [
          "bg-[hsl(var(--toggle-bg-subtle)/0.12)] hover:bg-[hsl(var(--toggle-bg-subtle)/0.24)] active:bg-[hsl(var(--toggle-bg-subtle)/0.36)] text-[hsl(var(--toggle-foreground-subtle))]",
          "data-[state=on]:bg-[hsl(var(--toggle-bg))] data-[state=on]:text-primary-foreground",
        ],
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
        info: "[--toggle-bg:var(--info)] [--toggle-bg-hover:var(--info-hover)]  [--toggle-bg-active:var(--info-active)] [--toggle-foreground:var(--info-foreground)] [--toggle-bg-subtle:var(--info-subtle)] [--toggle-foreground-subtle:var(--info-subtle-foreground)]",
        destructive:
          "[--toggle-bg:var(--destructive)] [--toggle-bg-hover:var(--destructive-hover)] [--toggle-bg-active:var(--destructive-active)] [--toggle-foreground:var(--destructive-foreground)] [--toggle-bg-subtle:var(--destructive-subtle)] [--toggle-foreground-subtle:var(--destructive-subtle-foreground)]",
        success:
          "[--toggle-bg:var(--success)] [--toggle-bg-hover:var(--success-hover)] [--toggle-bg-active:var(--success-active)] [--toggle-foreground:var(--success-foreground)] [--toggle-bg-subtle:var(--success-subtle)] [--toggle-foreground-subtle:var(--success-subtle-foreground)]",
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
        colorScheme: "primary",
        variant: "outline",
        className: "border-[hsl(var(--primary))]",
      },
    ],
    defaultVariants: {
      variant: "solid",
      colorScheme: "primary",
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
