import { cn } from "@/lib/utils"
import { PropsWithChildren, ReactNode } from "react"
import { PageContainer } from "./PageContainer"

/* -------------------------------------------------------------------------------------------------
 * Layout
 * -----------------------------------------------------------------------------------------------*/

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

const Layout = ({ children, ...props }: LayoutProps) => (
  <div className="flex min-h-screen flex-col" {...props}>
    {children}
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * LayoutHero
 * -----------------------------------------------------------------------------------------------*/

const LayoutHero = ({ children }: PropsWithChildren) => (
  <div className="relative">{children}</div>
)

/* -------------------------------------------------------------------------------------------------
 * LayoutHeadline
 * -----------------------------------------------------------------------------------------------*/

interface LayoutHeadlineProps {
  title: ReactNode
}

const LayoutHeadline = ({ title }: LayoutHeadlineProps) => (
  <PageContainer>
    <h1 className="pt-9 pb-14 font-bold font-display text-4xl text-white tracking-tight sm:text-5xl">
      {title}
    </h1>
  </PageContainer>
)

/* -------------------------------------------------------------------------------------------------
 * LayoutBannerBackground
 * -----------------------------------------------------------------------------------------------*/

interface LayoutBannerBackgroundProps {
  className?: string
}

const LayoutBannerBackground = ({ className }: LayoutBannerBackgroundProps) => (
  <div className={cn("absolute inset-0 bg-banner", className)} />
)

/* -------------------------------------------------------------------------------------------------
 * LayoutBanner
 * -----------------------------------------------------------------------------------------------*/

interface LayoutBannerProps extends PropsWithChildren {
  className?: string
}

const LayoutBanner = ({ children, className }: LayoutBannerProps) => (
  <div
    className={cn("-z-10 -bottom-48 absolute inset-0 overflow-hidden", className)}
  >
    {children}
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * LayoutMain
 * -----------------------------------------------------------------------------------------------*/

const LayoutMain = ({ children }: PropsWithChildren) => (
  <main>
    <PageContainer>{children}</PageContainer>
  </main>
)

/* -------------------------------------------------------------------------------------------------
 * LayoutFooter
 * -----------------------------------------------------------------------------------------------*/

const LayoutFooter = ({ children }: PropsWithChildren) => (
  <footer className="mt-auto">
    <PageContainer>{children}</PageContainer>
  </footer>
)

/* -----------------------------------------------------------------------------------------------*/

export {
  LayoutBanner,
  LayoutBannerBackground,
  LayoutFooter,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  Layout,
}
