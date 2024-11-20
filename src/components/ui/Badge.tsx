import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "lib/cssUtils";
import { type ElementRef, type HTMLAttributes, forwardRef } from "react";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 transition-colors focus:outline-none focus-visible:ring-4 focus:ring-ring font-medium max-w-max gap-1.5 bg-badge-background text-badge-foreground",
  {
    variants: {
      size: {
        sm: "text-xs h-5",
        md: "text-sm h-6",
        lg: "text-base h-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<ElementRef<"div">, BadgeProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ size }), className)}
      {...props}
    />
  ),
);

export { Badge };
