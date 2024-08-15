import { cn } from "@/lib/utils"
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import { ButtonHTMLAttributes, forwardRef } from "react"

const buttonVariants = cva(
  "font-semibold inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl text-base text-ellipsis overflow-hidden gap-1.5 cursor-pointer",
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      colorScheme,
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
        className={cn(buttonVariants({ variant, colorScheme, size, className }))}
        ref={ref}
        {...props}
        disabled={isLoading || disabled}
      >
        {isLoading ? <CircleNotch weight="bold" className="animate-spin" /> : null}

        {isLoading ? (
          <span>{loadingText}</span>
        ) : typeof children === "string" ? (
          <span>{children}</span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
