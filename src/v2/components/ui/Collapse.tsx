import { cn } from "@/lib/utils"
import { forwardRef, HTMLAttributes } from "react"

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  animateOpacity?: boolean
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  ({ className, open, animateOpacity, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid transition-all duration-300", className)}
      style={{
        opacity: animateOpacity ? (open ? 1 : 0) : undefined,
        gridTemplateRows: open ? "1fr" : "0fr",
      }}
      {...props}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
)
