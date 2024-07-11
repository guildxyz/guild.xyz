import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { forwardRef } from "react"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, asChild = false }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={clsx("mx-auto max-w-screen-lg px-4 sm:px-8 md:px-10", className)}
        ref={ref}
      >
        {children}
      </Comp>
    )
  }
)
