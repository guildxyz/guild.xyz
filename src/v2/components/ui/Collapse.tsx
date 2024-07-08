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
      className="grid transition-all duration-300"
      style={{
        opacity: animateOpacity ? (open ? 1 : 0) : undefined,
        gridTemplateRows: open ? "1fr" : "0fr",
      }}
      {...props}
    >
      <div className={cn("overflow-hidden", open ? className : "")}>{children}</div>
    </div>
  )
)
