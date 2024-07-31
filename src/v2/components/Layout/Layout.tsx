import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { HTMLAttributes, forwardRef } from "react"

const Layout = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className="flex min-h-screen flex-col" {...props}>
    {children}
  </div>
)

interface LayoutContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const LayoutContainer = forwardRef<HTMLDivElement, LayoutContainerProps>(
  ({ children, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(
          "mx-auto w-full max-w-screen-lg px-4 sm:px-8 md:px-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

const LayoutHero = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative pb-40", className)} {...props}>
    {children}
  </div>
)

const LayoutBanner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("-z-10 absolute inset-0 overflow-hidden bg-banner", className)}
    {...props}
  />
)

const LayoutHeadline = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <LayoutContainer
    className={cn("mt-6 flex items-center gap-5 md:mt-9", className)}
    {...props}
  >
    {children}
  </LayoutContainer>
)

const LayoutTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "font-bold font-display text-4xl text-white tracking-tight sm:text-5xl",
      className
    )}
    {...props}
  >
    {children}
  </h1>
)

const LayoutMain = ({ children, className, ...props }: LayoutContainerProps) => (
  <LayoutContainer className={cn("-top-28 relative", className)} {...props} asChild>
    <main>{children}</main>
  </LayoutContainer>
)

const LayoutFooter = ({ children, className, ...props }: LayoutContainerProps) => (
  <LayoutContainer className={cn("mt-auto", className)} {...props} asChild>
    <footer>{children}</footer>
  </LayoutContainer>
)

export {
  LayoutBanner,
  LayoutFooter,
  LayoutHeadline,
  LayoutTitle,
  LayoutHero,
  LayoutMain,
  LayoutContainer,
  Layout,
}
