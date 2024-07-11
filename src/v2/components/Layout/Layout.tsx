import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { PropsWithChildren, ReactNode, forwardRef } from "react"

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

const Root = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col">{children}</div>
)

/* -------------------------------------------------------------------------------------------------
 * PageContainer
 * -----------------------------------------------------------------------------------------------*/

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
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

/* -------------------------------------------------------------------------------------------------
 * Hero
 * -----------------------------------------------------------------------------------------------*/

const Hero = ({ children }: PropsWithChildren) => (
  <div className="relative">{children}</div>
)

/* -------------------------------------------------------------------------------------------------
 * Headline
 * -----------------------------------------------------------------------------------------------*/

interface HeadlineProps {
  title: ReactNode
}

const Headline = ({ title }: HeadlineProps) => (
  <PageContainer>
    <h1 className="pt-9 pb-14 font-bold font-display text-4xl text-white tracking-tight sm:text-5xl">
      {title}
    </h1>
  </PageContainer>
)

/* -------------------------------------------------------------------------------------------------
 * Banner
 * -----------------------------------------------------------------------------------------------*/

interface BannerProps extends PropsWithChildren {
  offset?: number
  className?: string
}

const Banner = ({ children, offset = 112, className }: BannerProps) => (
  <div
    className={"-z-10 absolute inset-0 overflow-hidden"}
    style={{ bottom: -offset }}
  >
    <div className={cn("absolute inset-0 bg-banner", className)} />
    {children}
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * Main
 * -----------------------------------------------------------------------------------------------*/

const Main = ({ children }: PropsWithChildren) => (
  <main>
    <PageContainer>{children}</PageContainer>
  </main>
)

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

const Footer = ({ children }: PropsWithChildren) => (
  <footer className="mt-auto">
    <PageContainer>{children}</PageContainer>
  </footer>
)

/* -----------------------------------------------------------------------------------------------*/

export { Banner, Footer, Headline, Hero, Main, PageContainer, Root }
