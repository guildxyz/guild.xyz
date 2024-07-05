import { cva, VariantProps } from "class-variance-authority"
import { forwardRef, InputHTMLAttributes } from "react"

const inputVariants = cva(
  "flex w-full border border-input bg-muted px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        xs: "h-6 rounded-md",
        sm: "h-8 rounded-lg",
        md: "h-11 rounded-lg",
        lg: "h-12 rounded-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => (
    <input
      type={type}
      className={inputVariants({ size, className })}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
