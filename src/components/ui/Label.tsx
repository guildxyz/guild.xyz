"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "lib/cssUtils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
