import clsx from "clsx"
import { forwardRef } from "react"

export type PageBoundaryProps = React.HTMLAttributes<HTMLDivElement>
export const PageBoundary = forwardRef<HTMLDivElement, PageBoundaryProps>(({ children, className }, ref) => (
  <div
    className={clsx("mx-auto max-w-screen-lg px-4 sm:px-8 md:px-10", className)}
    ref={ref}
  >
    {children}
  </div>
))
