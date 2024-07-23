"use client"

import { cn } from "@/lib/utils"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { VariantProps, cva } from "class-variance-authority"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

const separatorVariants = cva("shrink-0", {
  variants: {
    variant: {
      default: "bg-border",
      muted: "bg-border-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
    VariantProps<typeof separatorVariants>
>(
  (
    { className, variant, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant }),
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
