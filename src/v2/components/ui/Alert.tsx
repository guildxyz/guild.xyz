import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { HTMLAttributes, forwardRef } from "react"

const alertVariants = cva(
  "relative w-full rounded-xl p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 text-foreground [&>svg~*]:pl-8 [&>svg~*]:mt-1",
  {
    variants: {
      variant: {
        success: "bg-alert-success [&>svg]:text-alert-success-icon",
        info: "bg-alert-info [&>svg]:text-alert-info-icon",
        warning: "bg-alert-warning [&>svg]:text-alert-warning-icon",
        error: "bg-alert-error [&>svg]:text-alert-error-icon",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("[&_p]:leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription, AlertTitle }
