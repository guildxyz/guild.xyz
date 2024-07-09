import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut"

const anchorVariants = cva(
  "underline-offset-4 focus-visible:ring-ring focus-visible:ring-4 outline-none",
  {
    variants: {
      variant: {
        default: "text-foreground hover:underline",
        highlighted: "text-anchor-foreground hover:underline",
        muted: "text-muted-foreground font-semibold hover:underline",
        silent: "",
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
  showExternal?: boolean
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    {
      className,
      variant,
      asChild = false,
      showExternal = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : Link

    return (
      <Comp
        className={cn(
          anchorVariants({ variant }),
          showExternal && "inline-flex items-center gap-1",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {showExternal && <ArrowSquareOut />}
      </Comp>
    )
  }
)
Anchor.displayName = "Anchor"

export { Anchor, anchorVariants }
