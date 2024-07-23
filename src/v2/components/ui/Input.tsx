import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { InputHTMLAttributes, forwardRef } from "react"

const inputVariants = cva(
  "flex w-full border border-input px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-card-secondary",
        muted: "bg-muted",
      },
      size: {
        xs: "h-6 rounded-md",
        sm: "h-8 rounded-lg",
        md: "h-11 rounded-lg",
        lg: "h-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, variant, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size, variant, className }))}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
