import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { InputHTMLAttributes, forwardRef } from "react"

const inputVariants = cva(
  "flex w-full border px-4 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus:ring-input-border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-[border-color,_box-shadow] bg-input-background border-input-border hover:border-input-border-accent focus:border-input-border-accent aria-[invalid=true]:border-input-border-invalid aria-[invalid=true]:ring-input-border-invalid",
  {
    variants: {
      size: {
        xs: "h-6 rounded-md",
        sm: "h-8 rounded-lg",
        md: "h-10 rounded-lg",
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
      className={cn(
        inputVariants({
          size,
          className,
        })
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
