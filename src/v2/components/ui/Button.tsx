import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"
import clsx from "clsx"

const buttonVariants = cva(
  "font-medium inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl text-base min-w-max",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active",
        outline:
          "border border-input border-2 hover:bg-secondary active:bg-secondary-hover",
        ghost: "hover:bg-secondary active:bg-secondary-hover",
        success:
          "bg-success text-success-foreground hover:bg-success-hover active:bg-success-active",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
        "destructive-ghost":
          "hover:bg-destructive-ghost-hover active:bg-destructive-ghost-active text-destructive-ghost-foreground",
        link: "text-muted-foreground underline-offset-4 hover:underline",
        unstyled: "",
      },
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-11 px-4 py-2",
        lg: "h-12 px-6 py-4 text-lg",
        xl: "h-14 px-6 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      loadingText,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <CircleNotch
            weight="bold"
            className={cn(
              "animate-spin",
              clsx({
                "mr-1.5": !!loadingText,
              })
            )}
          />
        ) : null}
        {isLoading ? loadingText : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
