import { cn } from "@/lib/cssUtils";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";

const iconButtonVariants = cva("p-0 shrink-0", {
  variants: {
    size: {
      xs: "size-6 text-xs",
      sm: "size-8 text-sm",
      md: "size-10",
      lg: "size-12 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface IconButtonProps
  extends Omit<
      ButtonProps,
      | "size"
      | "loadingText"
      | "leftIcon"
      | "rightIcon"
      | "asChild"
      | "children"
      | "aria-label"
    >,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
  icon: ButtonProps["leftIcon"];
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size, icon, className, ...props }, ref) => (
    <Button
      ref={ref}
      {...props}
      className={cn(iconButtonVariants({ size, className }))}
    >
      {icon}
    </Button>
  ),
);

export { IconButton };
