"use client";

import { cn } from "@/lib/cssUtils";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps, cva } from "class-variance-authority";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 font-medium",
  {
    variants: {
      variant: {
        secondary:
          "text-button-secondary-foreground hover:bg-button-secondary-background data-[state=on]:bg-button-secondary-background active:bg-button-secondary-background-hover",
        primary:
          "hover:bg-button-secondary-background-hover active:bg-button-secondary-background-active data-[state=on]:bg-button-primary-background data-[state=on]:text-button-primary-foreground bg-button-secondary-background text-button-secondary-foreground",
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
  },
);

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
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
