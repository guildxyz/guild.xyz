import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export const cardClassName =
  "overflow-hidden rounded-2xl bg-card text-card-foreground shadow-md"

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(cardClassName, className)} {...props} />
  )
)
Card.displayName = "Card"

export { Card }
