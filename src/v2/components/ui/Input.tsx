import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { InputHTMLAttributes, forwardRef } from "react"

export const inputVariants = cva(
  "flex w-full border border-input-border bg-input-background px-4 py-2 transition-[border-color,_box-shadow] file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground hover:border-input-border-accent focus:border-input-border-accent focus:ring-input-border-accent focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-input-border-invalid aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-input-border-invalid aria-[invalid=true]:focus:border-input-border-accent aria-[invalid=true]:focus:ring-input-border-accent",
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
