"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "lib/cssUtils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

export type CheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "relative size-4 shrink-0 rounded-sm border-2 border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-0 data-[state=checked]:bg-primary data-[state=checked]:text-white [&~label]:cursor-pointer [&~label]:disabled:cursor-not-allowed [&~label]:disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="absolute inset-0 flex items-center justify-center rounded-full bg-primary">
      <Check className="size-[75%]" weight="bold" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
