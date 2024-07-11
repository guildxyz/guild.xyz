import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { ElementRef, HTMLAttributes, forwardRef } from "react"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-2 px-2 transition-colors focus:outline-none focus-visible:ring-4 focus:ring-ring",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
      },
      size: {
        sm: "text-xs h-5",
        md: "text-sm h-6",
        lg: "text-base h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<ElementRef<"div">, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
)

export { Badge, badgeVariants }
