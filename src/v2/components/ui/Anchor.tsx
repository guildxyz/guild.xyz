import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"

const anchorVariants = cva(
  "underline-offset-4 focus-visible:ring-ring focus-visible:ring-4",
  {
    variants: {
      variant: {
        default:
          "text-link hover:underline",
        muted: "text-muted-foreground font-bold hover:underline",
        silent: ""
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AnchorProps
  extends React.ComponentProps<typeof Link>,
  VariantProps<typeof anchorVariants> {
  asChild?: boolean
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    {
      className,
      variant,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : Link

    return (
      <Comp
        className={cn(anchorVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Anchor.displayName = "Anchor"

export { Anchor, anchorVariants }
