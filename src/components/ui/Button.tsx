import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "lib/cssUtils";
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

const buttonVariants = cva(
  "font-semibold inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-4 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-xl text-base text-ellipsis overflow-hidden gap-1.5 cursor-pointer [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] active:bg-[var(--button-bg-active)] text-[var(--button-foreground)]",
        ghost:
          "bg-[color-mix(in_srgb,_var(--button-bg-subtle)_var(--button-bg-opacity),_transparent)] [--button-bg-opacity:0%] hover:[--button-bg-opacity:12%] active:[--button-bg-opacity:24%] text-[var(--button-foreground-subtle)]",
        subtle:
          "bg-[color-mix(in_srgb,_var(--button-bg-subtle)_var(--button-bg-opacity),_transparent)] [--button-bg-opacity:12%] hover:[--button-bg-opacity:24%] active:[--button-bg-opacity:36%] text-[var(--button-foreground-subtle)]",
        outline:
          "bg-[color-mix(in_srgb,_var(--button-bg-subtle)_var(--button-bg-opacity),_transparent)] [--button-bg-opacity:0%] hover:[--button-bg-opacity:12%] active:[--button-bg-opacity:24%] text-[var(--button-foreground-subtle)] border-2 border-[var(--button-foreground-subtle)]",
        unstyled: "",
      },
      colorScheme: {
        primary:
          "[--button-bg:var(--button-primary)] [--button-bg-hover:var(--button-primary-hover)] [--button-bg-active:var(--button-primary-active)] [--button-foreground:var(--button-primary-foreground)] [--button-bg-subtle:var(--button-primary-subtle)] [--button-foreground-subtle:var(--button-primary-subtle-foreground)]",
        secondary:
          "[--button-bg:var(--button-secondary)] [--button-bg-hover:var(--button-secondary-hover)] [--button-bg-active:var(--button-secondary-active)] [--button-foreground:var(--button-secondary-foreground)] [--button-bg-subtle:var(--button-secondary-subtle)] [--button-foreground-subtle:var(--button-secondary-subtle-foreground)]",
        info: "[--button-bg:var(--button-info)] [--button-bg-hover:var(--button-info-hover)]  [--button-bg-active:var(--button-info-active)] [--button-foreground:var(--button-info-foreground)] [--button-bg-subtle:var(--button-info-subtle)] [--button-foreground-subtle:var(--button-info-subtle-foreground)]",
        destructive:
          "[--button-bg:var(--button-destructive)] [--button-bg-hover:var(--button-destructive-hover)] [--button-bg-active:var(--button-destructive-active)] [--button-foreground:var(--button-destructive-foreground)] [--button-bg-subtle:var(--button-destructive-subtle)] [--button-foreground-subtle:var(--button-destructive-subtle-foreground)]",
        success:
          "[--button-bg:var(--button-success)] [--button-bg-hover:var(--button-success-hover)] [--button-bg-active:var(--button-success-active)] [--button-foreground:var(--button-success-foreground)] [--button-bg-subtle:var(--button-success-subtle)] [--button-foreground-subtle:var(--button-success-subtle-foreground)]",
      },
      size: {
        xs: "h-6 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-sm gap-1",
        md: "h-11 px-4 py-2",
        lg: "h-12 px-6 py-4 text-lg",
        xl: "h-14 px-6 py-4 text-lg gap-2",
      },
    },
    compoundVariants: [
      {
        colorScheme: "secondary",
        variant: "outline",
        className: "border-[var(--secondary)]",
      },
    ],
    defaultVariants: {
      variant: "solid",
      colorScheme: "secondary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
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
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, colorScheme, size, className }),
        )}
        ref={ref}
        {...props}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <CircleNotch weight="bold" className="animate-spin" />
        ) : (
          leftIcon
        )}

        {isLoading ? (
          loadingText ? (
            <span>{loadingText}</span>
          ) : null
        ) : typeof children === "string" ? (
          <span>{children}</span>
        ) : (
          children
        )}

        {rightIcon}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
