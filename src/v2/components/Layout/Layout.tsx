import { ReactNode } from "react"
import { PropsWithChildren } from "react"
import { PageBoundary } from "@/components/PageBoundary"
// import { Header as NavHeader } from "@/components/Header"
const NavHeader = () => <div className="h-16 border-border border-b">mocked header</div>

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

const Root = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col">{children}</div>
)

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

const Header = ({ children }: PropsWithChildren) => (
  <header className="relative">
    <NavHeader />
    {children}
  </header>
)

/* -------------------------------------------------------------------------------------------------
 * Headline
 * -----------------------------------------------------------------------------------------------*/

interface HeadlineProps {
  title: ReactNode
}

const Headline = ({ title }: HeadlineProps) => (
  <PageBoundary>
    <h1 className="pb-14 pt-9 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
      {title}
    </h1>
  </PageBoundary>
)

/* -------------------------------------------------------------------------------------------------
 * Banner
 * -----------------------------------------------------------------------------------------------*/

const Banner = () => (
  <div className="absolute inset-0 -bottom-28 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(240deg_4%_16%)]" />
    <div className="absolute inset-0 bg-[url('/banner.png')] bg-[auto_115%] bg-[right_top_10px] bg-no-repeat opacity-10" />
    <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(240deg_2.65%_22.16%)] from-50% to-transparent" />
  </div>
)

/* -------------------------------------------------------------------------------------------------
 * Main
 * -----------------------------------------------------------------------------------------------*/

const Main = ({ children }: PropsWithChildren) => (
  <main>
    <PageBoundary>{children}</PageBoundary>
  </main>
)

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

const Footer = ({ children }: PropsWithChildren) => (
  <footer className="mt-auto">
    <PageBoundary>{children}</PageBoundary>
  </footer>
)

/* -----------------------------------------------------------------------------------------------*/

export { Root, Header, Headline, Banner, Main, Footer }
